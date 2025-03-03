package com.esprit.userAuth.repositories;

import com.esprit.userAuth.entities.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByCertificationId (Long certificationId);
}

