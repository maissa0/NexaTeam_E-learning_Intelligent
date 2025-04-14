package com.esprit.userAuth.service.impl;

import com.esprit.userAuth.entity.AuditLog;
import com.esprit.userAuth.entity.Certificate;
import com.esprit.userAuth.repository.AuditLogRepository;
import com.esprit.userAuth.service.AuditLogService;
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
    public void logCertDeletion(String username, String certId) {


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
    public List<AuditLog> getAuditLogsForCertificationId(String id) {
        return auditLogRepository.findByCertificationId(id);
    }



}
