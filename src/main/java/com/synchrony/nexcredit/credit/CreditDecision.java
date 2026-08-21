package com.synchrony.nexcredit.credit;

import java.util.Map;

public class CreditDecision {
    private Long applicationId;
    private final String creditDecision;
    private final int confidenceScore;
    private final String reasoning;
    private final String fraudRisk;
    private Map<String, Double> modelContributions;
    private Map<String, Double> fraudSubSignals;
    private String modelVersion = "logreg-ntc-1.0";
    private String dataProvenance = "synthetic-consent";
    private boolean mlPowered;

    public CreditDecision(String creditDecision, int confidenceScore, String reasoning, String fraudRisk) {
        this.creditDecision = creditDecision;
        this.confidenceScore = confidenceScore;
        this.reasoning = reasoning;
        this.fraudRisk = fraudRisk;
    }

    public String getCreditDecision() { return creditDecision; }
    public int getConfidenceScore() { return confidenceScore; }
    public String getReasoning() { return reasoning; }
    public String getFraudRisk() { return fraudRisk; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public Map<String, Double> getModelContributions() { return modelContributions; }
    public void setModelContributions(Map<String, Double> modelContributions) { this.modelContributions = modelContributions; }
    public Map<String, Double> getFraudSubSignals() { return fraudSubSignals; }
    public void setFraudSubSignals(Map<String, Double> fraudSubSignals) { this.fraudSubSignals = fraudSubSignals; }
    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
    public String getDataProvenance() { return dataProvenance; }
    public void setDataProvenance(String dataProvenance) { this.dataProvenance = dataProvenance; }
    public boolean isMlPowered() { return mlPowered; }
    public void setMlPowered(boolean mlPowered) { this.mlPowered = mlPowered; }
}
