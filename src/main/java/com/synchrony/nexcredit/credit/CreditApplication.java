package com.synchrony.nexcredit.credit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "credit_applications")
public class CreditApplication {

    @Id
    @SequenceGenerator(name = "credit_application_sequence", sequenceName = "credit_application_sequence", allocationSize = 1)
    @GeneratedValue(generator = "credit_application_sequence", strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String applicantName;

    @NotNull
    @Min(18)
    private Integer age;

    @NotNull
    @Min(0)
    private BigDecimal annualIncome;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmploymentType employmentType;

    @NotNull @Min(0) @Max(100)
    private Integer mobileUsageScore;

    @NotNull @Min(0) @Max(100)
    private Integer transactionBehaviorScore;

    @NotNull @Min(0) @Max(100)
    private Integer socialSignalScore;

    private String creditDecision;
    private Integer confidenceScore;
    @Column(length = 1000)
    private String reasoning;
    private String fraudRisk;
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus;
    @Column(length = 1000)
    private String reviewerNotes;
    @Column(length = 500)
    private String documentPath;
    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;

    @PrePersist
    void setCreatedAtIfAbsent() {
        if (createdAt == null) {
            createdAt = new Timestamp(System.currentTimeMillis());
        }
    }

    public CreditApplication() { }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }
    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }
    public Integer getMobileUsageScore() { return mobileUsageScore; }
    public void setMobileUsageScore(Integer mobileUsageScore) { this.mobileUsageScore = mobileUsageScore; }
    public Integer getTransactionBehaviorScore() { return transactionBehaviorScore; }
    public void setTransactionBehaviorScore(Integer transactionBehaviorScore) { this.transactionBehaviorScore = transactionBehaviorScore; }
    public Integer getSocialSignalScore() { return socialSignalScore; }
    public void setSocialSignalScore(Integer socialSignalScore) { this.socialSignalScore = socialSignalScore; }
    public String getCreditDecision() { return creditDecision; }
    public void setCreditDecision(String creditDecision) { this.creditDecision = creditDecision; }
    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
    public String getFraudRisk() { return fraudRisk; }
    public void setFraudRisk(String fraudRisk) { this.fraudRisk = fraudRisk; }
    public ReviewStatus getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(ReviewStatus reviewStatus) { this.reviewStatus = reviewStatus; }
    public String getReviewerNotes() { return reviewerNotes; }
    public void setReviewerNotes(String reviewerNotes) { this.reviewerNotes = reviewerNotes; }
    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
