package com.esprit.userAuth.repository;

import com.esprit.userAuth.entity.CompanyRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRegistrationRequestRepository extends JpaRepository<CompanyRegistrationRequest, Long> {
    List<CompanyRegistrationRequest> findByStatus(CompanyRegistrationRequest.RequestStatus status);
    boolean existsByName(String name);
    boolean existsByEmailCompany(String email);
} 