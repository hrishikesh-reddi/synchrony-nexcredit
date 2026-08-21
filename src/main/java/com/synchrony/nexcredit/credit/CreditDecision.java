package com.synchrony.nexcredit.credit;

public class CreditDecision {
    private Long applicationId;
    private final String creditDecision;
    private final int confidenceScore;
    private final String reasoning;
    private final String fraudRisk;

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
}
