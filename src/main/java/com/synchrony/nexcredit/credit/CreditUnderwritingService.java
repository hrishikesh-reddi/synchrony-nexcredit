package com.synchrony.nexcredit.credit;

import com.synchrony.nexcredit.ai.MlRiskModel;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CreditUnderwritingService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CreditUnderwritingService.class);
    private final CreditApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;
    private final MlRiskModel mlRiskModel;
    private final DocumentEvidenceRepository documentEvidenceRepository;

    public CreditUnderwritingService(CreditApplicationRepository applicationRepository, AuditLogService auditLogService, MlRiskModel mlRiskModel) {
        this(applicationRepository, auditLogService, mlRiskModel, null);
    }

    public CreditUnderwritingService(CreditApplicationRepository applicationRepository, AuditLogService auditLogService, MlRiskModel mlRiskModel, DocumentEvidenceRepository documentEvidenceRepository) {
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
        this.mlRiskModel = mlRiskModel;
        this.documentEvidenceRepository = documentEvidenceRepository;
    }

    public CreditDecision analyze(CreditApplication app) {
        CreditDecision creditDecision = evaluate(app);
        String decision = creditDecision.getCreditDecision();
        int confidence = creditDecision.getConfidenceScore();
        String reasoning = creditDecision.getReasoning();
        String fraudRisk = creditDecision.getFraudRisk();

        app.setCreditDecision(decision);
        app.setConfidenceScore(confidence);
        app.setReasoning(reasoning);
        app.setFraudRisk(fraudRisk);
        app.setReviewStatus(resolveReviewStatus(app, decision, confidence, fraudRisk));
        CreditApplication savedApplication = applicationRepository.save(app);
        creditDecision.setApplicationId(savedApplication.getId());
        auditLogService.record(app, creditDecision);
        LOGGER.info("underwriting_decision applicationId={} decision={} confidence={} fraudRisk={} mlPowered={} reviewStatus={}",
                savedApplication.getId(), decision, confidence, fraudRisk, creditDecision.isMlPowered(), savedApplication.getReviewStatus());
        return creditDecision;
    }

    public CreditDecision evaluate(CreditApplication app) {
        if (mlRiskModel.isAvailable()) {
            return evaluateWithMl(app);
        }
        return evaluateRuleBased(app);
    }

    private CreditDecision evaluateWithMl(CreditApplication app) {
        double probability = mlRiskModel.predictProbability(app);
        int confidence = (int) Math.round(probability * 100);
        Map<String, Double> contributions = mlRiskModel.contributions(app);

        String decision;
        if (probability >= 0.66) {
            decision = "APPROVED";
        } else if (probability <= 0.33) {
            decision = "REJECTED";
        } else {
            decision = "PENDING";
        }

        String reasoning = buildMlReasoning(probability, contributions);

        Map<String, Double> fraudSubSignals = computeFraudSubSignals(app);
        String fraudRisk = deriveFraudRisk(fraudSubSignals);
        reasoning = appendFraudReasoning(reasoning, fraudSubSignals);

        if (app.getAge() != null && app.getAge() < 21 && "REJECTED".equals(decision)) {
            decision = "PENDING";
            reasoning += " [BIAS GUARDRAIL: Age-based rejection escalated to human review.]";
            confidence = Math.min(confidence, 60);
        }

        CreditDecision creditDecision = new CreditDecision(decision, confidence, reasoning, fraudRisk);
        creditDecision.setModelContributions(contributions);
        creditDecision.setFraudSubSignals(fraudSubSignals);
        creditDecision.setModelVersion("logreg-ntc-1.0");
        creditDecision.setDataProvenance("synthetic-consent");
        creditDecision.setMlPowered(true);
        return creditDecision;
    }

    private String buildMlReasoning(double probability, Map<String, Double> contributions) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("ML risk model (logistic regression on alternative-data signals) estimated an approve probability of %.0f%%. ", probability * 100));
        List<Map.Entry<String, Double>> sorted = new ArrayList<>(contributions.entrySet());
        sorted.sort((a, b) -> Double.compare(Math.abs(b.getValue()), Math.abs(a.getValue())));
        sb.append("Strongest drivers: ");
        for (int i = 0; i < Math.min(3, sorted.size()); i++) {
            Map.Entry<String, Double> entry = sorted.get(i);
            String direction = entry.getValue() >= 0 ? "supported approval" : "weighed against approval";
            sb.append(prettyName(entry.getKey())).append(" (").append(direction).append("), ");
        }
        return sb.substring(0, sb.length() - 2).trim();
    }

    private String prettyName(String key) {
        return switch (key) {
            case "mobile" -> "mobile usage";
            case "transaction" -> "transaction behaviour";
            case "social" -> "social signal";
            case "income" -> "income stability";
            case "age" -> "applicant age";
            case "employment" -> "employment type";
            default -> key;
        };
    }

    public CreditDecision evaluateRuleBased(CreditApplication app) {
        int total = app.getMobileUsageScore()
                + app.getTransactionBehaviorScore()
                + app.getSocialSignalScore();

        String decision;
        int confidence;
        String reasoning;
        String fraudRisk;

        if (app.getMobileUsageScore() < 25 || app.getTransactionBehaviorScore() < 25) {
            decision = "REJECTED";
            confidence = 92;
            reasoning = "Low alternative data scores indicate insufficient financial track record. Mobile usage and transaction patterns fall below risk thresholds.";
            fraudRisk = "HIGH";
        } else if (total > 210 && app.getAnnualIncome() != null
                && app.getAnnualIncome().compareTo(BigDecimal.valueOf(300000)) > 0) {
            decision = "APPROVED";
            confidence = 88;
            reasoning = "Strong alternative data profile with consistent mobile engagement and healthy transaction behavior. Income stability supports creditworthiness.";
            fraudRisk = "LOW";
        } else if (total > 180) {
            decision = "APPROVED";
            confidence = 76;
            reasoning = "Moderate alternative data indicators suggest manageable risk. Recommend standard credit limit with monitoring.";
            fraudRisk = "LOW";
        } else {
            decision = "PENDING";
            confidence = 65;
            reasoning = "Alternative data is inconclusive. Recommend human underwriter review for final decision.";
            fraudRisk = "MEDIUM";
        }

        if (app.getAge() < 21 && decision.equals("REJECTED")) {
            decision = "PENDING";
            reasoning += " [BIAS GUARDRAIL: Age-based rejection escalated to human review.]";
            confidence = 60;
        }

        Map<String, Double> fraudSubSignals = computeFraudSubSignals(app);
        fraudRisk = deriveFraudRisk(fraudSubSignals);
        reasoning = appendFraudReasoning(reasoning, fraudSubSignals);

        CreditDecision creditDecision = new CreditDecision(decision, confidence, reasoning, fraudRisk);
        creditDecision.setFraudSubSignals(fraudSubSignals);
        creditDecision.setModelVersion("logreg-ntc-1.0");
        creditDecision.setDataProvenance("synthetic-consent");
        return creditDecision;
    }

    private DocumentEvidence resolveEvidence(CreditApplication app) {
        if (documentEvidenceRepository == null || app.getId() == null) {
            return null;
        }
        Optional<DocumentEvidence> evidence = documentEvidenceRepository.findTopByApplicationIdOrderByCreatedAtDesc(app.getId());
        return evidence.orElse(null);
    }

    private Map<String, Double> computeFraudSubSignals(CreditApplication app) {
        Map<String, Double> signals = new LinkedHashMap<>();
        int mobile = app.getMobileUsageScore() == null ? 0 : app.getMobileUsageScore();
        int transaction = app.getTransactionBehaviorScore() == null ? 0 : app.getTransactionBehaviorScore();
        int social = app.getSocialSignalScore() == null ? 0 : app.getSocialSignalScore();
        double inconsistency = clamp(
                (Math.abs(mobile - transaction) + Math.abs(transaction - social) + Math.abs(mobile - social)) / 200.0,
                0.0, 1.0);
        signals.put("signalInconsistency", inconsistency);

        double income = app.getAnnualIncome() == null ? 0.0 : app.getAnnualIncome().doubleValue();
        double incomeMismatch = (income > 1_500_000 && mobile < 30) ? 1.0 : 0.0;
        signals.put("signalIncomeSignalMismatch", incomeMismatch);

        double docDivergence = 0.0;
        DocumentEvidence evidence = resolveEvidence(app);
        if (evidence != null && evidence.getExtractedAnnualIncome() != null && app.getAnnualIncome() != null) {
            double stated = app.getAnnualIncome().doubleValue();
            double extracted = evidence.getExtractedAnnualIncome().doubleValue();
            if (Math.abs(stated - extracted) > 0.3 * stated) {
                docDivergence = 1.0;
            }
        }
        signals.put("signalDocIncomeDivergence", docDivergence);
        return signals;
    }

    private String deriveFraudRisk(Map<String, Double> signals) {
        boolean anyHigh = signals.values().stream().anyMatch(v -> v == 1.0);
        double max = signals.values().stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        if (anyHigh) {
            return "HIGH";
        }
        if (max >= 0.4) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private String appendFraudReasoning(String reasoning, Map<String, Double> signals) {
        StringBuilder sb = new StringBuilder(reasoning);
        if (signals.getOrDefault("signalInconsistency", 0.0) == 1.0) {
            sb.append(" [FRAUD SIGNAL: alternative-data signals are internally inconsistent.]");
        }
        if (signals.getOrDefault("signalIncomeSignalMismatch", 0.0) == 1.0) {
            sb.append(" [FRAUD SIGNAL: high stated income conflicts with weak mobile usage signal.]");
        }
        if (signals.getOrDefault("signalDocIncomeDivergence", 0.0) == 1.0) {
            sb.append(" [FRAUD SIGNAL: stated income diverges from income extracted from uploaded document.]");
        }
        return sb.toString();
    }

    private double clamp(double value, double lo, double hi) {
        return Math.max(lo, Math.min(hi, value));
    }

    private ReviewStatus resolveReviewStatus(CreditApplication app, String decision, int confidence, String fraudRisk) {
        if (confidence < 70 || "HIGH".equals(fraudRisk)
                || (app.getAge() != null && app.getAge() < 21 && "REJECTED".equals(decision))) {
            return ReviewStatus.PENDING_REVIEW;
        }
        return "APPROVED".equals(decision) ? ReviewStatus.AUTO_APPROVED : ReviewStatus.AUTO_REJECTED;
    }
}
