package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.AuditLog;
import com.esprit.userAuth.entity.Certificate;

import java.util.List;

public interface AuditLogService {
    void logCertCreation(String username, Certificate cert);

    void logCertUpdate(String username, Certificate cert);

    void logCertDeletion(String username, String certId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForCertificationId(String id);
}
