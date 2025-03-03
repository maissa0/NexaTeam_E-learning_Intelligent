package com.esprit.userAuth.services.impl;

import com.esprit.userAuth.entities.AuditLog;
import com.esprit.userAuth.entities.Certificate;
import com.esprit.userAuth.repositories.AuditLogRepository;
import com.esprit.userAuth.services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    AuditLogRepository auditLogRepository;

    @Override
    public void logCertCreation(String username, Certificate cert) {

        AuditLog log = new AuditLog();
        log.setAction("CREATE");
        log.setUsername(username);
        log.setCertificationId(cert.getId());
        log.setCertificationName(cert.getTitle());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logCertUpdate(String username, Certificate cert) {


        AuditLog log = new AuditLog();
        log.setAction("UPDATE");
        log.setUsername(username);
        log.setCertificationId(cert.getId());
        log.setCertificationName(cert.getTitle());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logCertDeletion(String username, Long certId) {


        AuditLog log = new AuditLog();
        log.setAction("DELETE");
        log.setUsername(username);
        log.setCertificationId(certId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getAuditLogsForCertificationId(Long id) {
        return auditLogRepository.findByCertificationId(id);
    }



}
