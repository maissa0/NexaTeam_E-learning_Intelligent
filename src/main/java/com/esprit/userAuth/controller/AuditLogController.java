package com.esprit.userAuth.controller;

import com.esprit.userAuth.entity.AuditLog;
import com.esprit.userAuth.service.AuditLogService;
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
    public List<AuditLog> getCertificationAuditLogs(@PathVariable String id){
        return auditLogService.getAuditLogsForCertificationId(id);
    }

}
