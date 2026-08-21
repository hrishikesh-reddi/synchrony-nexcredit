package com.synchrony.nexcredit.credit;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

@Component
public class CreditSeedData {
    private final CreditApplicationRepository repository;

    public CreditSeedData(CreditApplicationRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void seedApplications() {
        if (repository.count() > 0) {
            return;
        }
        repository.saveAll(List.of(
                application("Ravi Kumar", 22, 300000, EmploymentType.GIG_WORKER, 85, 80, 70, "APPROVED", 76, "Strong alternative data profile for a new-to-credit gig worker.", "LOW", ReviewStatus.REVIEWED),
                application("Priya Sharma", 35, 800000, EmploymentType.SALARIED, 20, 45, 50, "REJECTED", 92, "Low mobile usage score indicates a possible fraud pattern requiring review.", "HIGH", ReviewStatus.PENDING_REVIEW),
                application("Amit Patel", 19, 150000, EmploymentType.STUDENT, 40, 35, 30, "PENDING", 65, "Thin-file applicant; human review is recommended.", "MEDIUM", ReviewStatus.PENDING_REVIEW),
                application("Sneha Reddy", 28, 400000, EmploymentType.SELF_EMPLOYED, 75, 70, 65, "APPROVED", 76, "Consistent alternative-data signals support approval.", "LOW", ReviewStatus.REVIEWED),
                application("Vikram Singh", 45, 1200000, EmploymentType.SALARIED, 50, 40, 45, "PENDING", 65, "Signals are inconclusive; route to a human underwriter.", "MEDIUM", ReviewStatus.PENDING_REVIEW)
        ));
    }

    private CreditApplication application(String name, int age, int income, EmploymentType employmentType,
                                           int mobile, int transaction, int social, String decision, int confidence,
                                           String reasoning, String fraudRisk, ReviewStatus reviewStatus) {
        CreditApplication application = new CreditApplication();
        application.setApplicantName(name);
        application.setAge(age);
        application.setAnnualIncome(BigDecimal.valueOf(income));
        application.setEmploymentType(employmentType);
        application.setMobileUsageScore(mobile);
        application.setTransactionBehaviorScore(transaction);
        application.setSocialSignalScore(social);
        application.setCreditDecision(decision);
        application.setConfidenceScore(confidence);
        application.setReasoning(reasoning);
        application.setFraudRisk(fraudRisk);
        application.setReviewStatus(reviewStatus);
        return application;
    }
}
