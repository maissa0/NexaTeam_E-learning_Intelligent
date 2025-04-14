package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Company;
import com.esprit.userAuth.entity.CompanyRegistrationRequest;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.repository.CompanyRegistrationRequestRepository;
import com.esprit.userAuth.repository.CompanyRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyService {
    CompanyRegistrationRequest submitRegistrationRequest(CompanyRegistrationRequest request);
    List<CompanyRegistrationRequest> getAllPendingRequests();
    Optional<CompanyRegistrationRequest> getRequestById(Long id);
    User approveCompanyRequest(Long requestId, String reason);
    void rejectCompanyRequest(Long requestId, String reason);
    List<Company> getAllCompanies();
    Optional<Company> getCompanyById(Long id);
    
    // Repository access methods
    CompanyRepository getCompanyRepository();
    CompanyRegistrationRequestRepository getRequestRepository();
} 