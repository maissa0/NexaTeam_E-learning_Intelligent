package com.esprit.userAuth.service.impl;

import com.esprit.userAuth.entity.*;
import com.esprit.userAuth.repository.CompanyRegistrationRequestRepository;
import com.esprit.userAuth.repository.CompanyRepository;
import com.esprit.userAuth.repository.RoleRepository;
import com.esprit.userAuth.repository.UserRepository;
import com.esprit.userAuth.service.CompanyService;
import com.esprit.userAuth.util.EmailService;
import com.esprit.userAuth.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRegistrationRequestRepository requestRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;

    @Override
    public CompanyRegistrationRequest submitRegistrationRequest(CompanyRegistrationRequest request) {
        // Set status to PENDING
        request.setStatus(CompanyRegistrationRequest.RequestStatus.PENDING);
        return requestRepository.save(request);
    }

    @Override
    public List<CompanyRegistrationRequest> getAllPendingRequests() {
        return requestRepository.findByStatus(CompanyRegistrationRequest.RequestStatus.PENDING);
    }

    @Override
    public Optional<CompanyRegistrationRequest> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    @Override
    @Transactional
    public User approveCompanyRequest(Long requestId, String reason) {
        // Get the request
        CompanyRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Company registration request not found"));
        
        // Check if the request is pending
        if (request.getStatus() != CompanyRegistrationRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Company registration request is not pending");
        }
        
        // Create a new company
        Company company = Company.builder()
                .name(request.getName())
                .address(request.getAddress())
                .logo(request.getLogo())
                .emailCompany(request.getEmailCompany())
                .description(request.getDescription())
                .build();
        
        company = companyRepository.save(company);
        
        // Generate a secure password
        String generatedPassword = PasswordGenerator.generateSecurePassword();
        
        // Create a user for the company with ROLE_COMPANY
        Role companyRole = roleRepository.findByRoleName(AppRole.ROLE_COMPANY)
                .orElseThrow(() -> new RuntimeException("Company role not found"));
        
        User companyUser = new User();
        companyUser.setUserName(request.getName()); // Username is the company name
        companyUser.setEmail(request.getEmailCompany());
        companyUser.setPassword(passwordEncoder.encode(generatedPassword));
        companyUser.setRole(companyRole);
        companyUser.setCompany(company);
        companyUser.setAccountNonLocked(true);
        companyUser.setAccountNonExpired(true);
        companyUser.setCredentialsNonExpired(true);
        companyUser.setEnabled(true);
        companyUser.setTwoFactorEnabled(false);
        companyUser.setSignUpMethod("admin_approval");
        
        companyUser = userRepository.save(companyUser);
        
        // Update the request status
        request.setStatus(CompanyRegistrationRequest.RequestStatus.APPROVED);
        requestRepository.save(request);
        
        // Send approval email with credentials
        emailService.sendCompanyRegistrationApprovalEmail(
                request.getEmailCompany(),
                request.getName(),
                companyUser.getUserName(),
                generatedPassword
        );
        
        return companyUser;
    }

    @Override
    @Transactional
    public void rejectCompanyRequest(Long requestId, String reason) {
        // Get the request
        CompanyRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Company registration request not found"));
        
        // Check if the request is pending
        if (request.getStatus() != CompanyRegistrationRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Company registration request is not pending");
        }
        
        // Update the request status
        request.setStatus(CompanyRegistrationRequest.RequestStatus.REJECTED);
        requestRepository.save(request);
        
        // Send rejection email
        emailService.sendCompanyRegistrationRejectionEmail(
                request.getEmailCompany(),
                request.getName(),
                reason
        );
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    @Override
    public List<User> getCompanyEmployees(Long companyId) {
        // Get the company first to verify it exists
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        // Find all users associated with this company
        return userRepository.findByCompany(company);
    }

    @Override
    public CompanyRepository getCompanyRepository() {
        return companyRepository;
    }
    
    @Override
    public CompanyRegistrationRequestRepository getRequestRepository() {
        return requestRepository;
    }
} 