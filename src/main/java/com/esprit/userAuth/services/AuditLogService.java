package com.esprit.userAuth.services;

import com.esprit.userAuth.entities.AuditLog;
import com.esprit.userAuth.entities.Certificate;

import java.util.List;

public interface AuditLogService {
    void logCertCreation(String username, Certificate cert);

    void logCertUpdate(String username, Certificate cert);

    void logCertDeletion(String username, Long certId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForCertificationId(Long id);
}
