package com.esprit.userAuth.controller;

import com.esprit.userAuth.entities.AuditLog;
import com.esprit.userAuth.services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {
    @Autowired
    AuditLogService auditLogService;

    @GetMapping
    public List<AuditLog> getAuditLogs(){
        return auditLogService.getAllAuditLogs();
    }

    @GetMapping("/cert/{id}")
    public List<AuditLog> getCertificationAuditLogs(@PathVariable Long id){
        return auditLogService.getAuditLogsForCertificationId(id);
    }

}
