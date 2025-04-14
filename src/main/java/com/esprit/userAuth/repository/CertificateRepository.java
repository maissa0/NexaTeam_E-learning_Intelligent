package com.esprit.userAuth.repository;

import com.esprit.userAuth.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUserUserId(Long userId);
    List<Certificate> findByUserUserName(String username);
}
