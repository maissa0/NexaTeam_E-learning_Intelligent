package com.esprit.userAuth.repository;

import com.esprit.userAuth.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByCertificationId (String certificationId);
}

