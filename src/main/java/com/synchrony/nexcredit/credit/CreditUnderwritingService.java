package com.synchrony.nexcredit.credit;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;

@Service
public class CreditUnderwritingService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CreditUnderwritingService.class);
    private final CreditApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;

    public CreditUnderwritingService(CreditApplicationRepository applicationRepository, AuditLogService auditLogService) {
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
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
        LOGGER.info("underwriting_decision applicationId={} decision={} confidence={} fraudRisk={} reviewStatus={}",
                savedApplication.getId(), decision, confidence, fraudRisk, savedApplication.getReviewStatus());
        return creditDecision;
    }

    public CreditDecision evaluate(CreditApplication app) {
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

        return new CreditDecision(decision, confidence, reasoning, fraudRisk);
    }

    private ReviewStatus resolveReviewStatus(CreditApplication app, String decision, int confidence, String fraudRisk) {
        if (confidence < 70 || "HIGH".equals(fraudRisk)
                || (app.getAge() != null && app.getAge() < 21 && "REJECTED".equals(decision))) {
            return ReviewStatus.PENDING_REVIEW;
        }
        return "APPROVED".equals(decision) ? ReviewStatus.AUTO_APPROVED : ReviewStatus.AUTO_REJECTED;
    }
}
