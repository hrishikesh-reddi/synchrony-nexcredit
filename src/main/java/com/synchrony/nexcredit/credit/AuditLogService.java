package com.synchrony.nexcredit.credit;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void record(CreditApplication application, CreditDecision decision) {
        auditLogRepository.save(new AuditLog(
                application.getId(),
                decision.getCreditDecision(),
                decision.getReasoning()));
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsForApplication(Long applicationId) {
        return auditLogRepository.findByApplicationIdOrderByTimestampDesc(applicationId);
    }
}
