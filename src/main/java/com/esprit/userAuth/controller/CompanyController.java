package com.esprit.userAuth.controller;

import com.esprit.userAuth.dtos.CompanyRegistrationRequestDTO;
import com.esprit.userAuth.entity.Company;
import com.esprit.userAuth.entity.CompanyRegistrationRequest;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.security.response.MessageResponse;
import com.esprit.userAuth.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    /**
     * Public endpoint for companies to submit registration requests
     */
    @PostMapping("/public/register")
    public ResponseEntity<?> submitRegistrationRequest(@Valid @RequestBody CompanyRegistrationRequestDTO requestDTO) {
        // Check if company name already exists
        if (companyService.getCompanyRepository().existsByName(requestDTO.getName())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Company name is already taken!"));
        }

        // Check if company email already exists
        if (companyService.getCompanyRepository().existsByEmailCompany(requestDTO.getEmailCompany())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Company email is already in use!"));
        }
        
        // Check if there's already a pending request with the same name or email
        if (companyService.getRequestRepository().existsByName(requestDTO.getName())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: A registration request with this company name already exists!"));
        }
        
        if (companyService.getRequestRepository().existsByEmailCompany(requestDTO.getEmailCompany())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: A registration request with this email already exists!"));
        }
        
        // Convert DTO to entity
        CompanyRegistrationRequest request = CompanyRegistrationRequest.builder()
                .name(requestDTO.getName())
                .address(requestDTO.getAddress())
                .logo(requestDTO.getLogo())
                .emailCompany(requestDTO.getEmailCompany())
                .description(requestDTO.getDescription())
                .build();
        
        try {
            CompanyRegistrationRequest savedRequest = companyService.submitRegistrationRequest(request);
            return ResponseEntity.ok(new MessageResponse("Company registration request submitted successfully. You will be notified via email once it's processed."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Admin endpoint to get all pending company registration requests
     */
    @GetMapping("/admin/pending-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompanyRegistrationRequest>> getPendingRequests() {
        List<CompanyRegistrationRequest> pendingRequests = companyService.getAllPendingRequests();
        return ResponseEntity.ok(pendingRequests);
    }

    /**
     * Admin endpoint to approve a company registration request
     */
    @PostMapping("/admin/approve-request/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long requestId,
            @RequestBody(required = false) Map<String, String> body) {
        
        String reason = (body != null) ? body.get("reason") : null;
        
        try {
            User companyUser = companyService.approveCompanyRequest(requestId, reason);
            return ResponseEntity.ok(new MessageResponse("Company registration request approved. Credentials have been sent to the company email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Admin endpoint to reject a company registration request
     */
    @PostMapping("/admin/reject-request/{requestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long requestId,
            @RequestBody(required = false) Map<String, String> body) {
        
        String reason = (body != null) ? body.get("reason") : null;
        
        try {
            companyService.rejectCompanyRequest(requestId, reason);
            return ResponseEntity.ok(new MessageResponse("Company registration request rejected."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Admin endpoint to get all registered companies
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    /**
     * Admin endpoint to get a specific company by ID
     */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        return companyService.getCompanyById(id)
                .map(company -> ResponseEntity.ok(company))
                .orElse(ResponseEntity.notFound().build());
    }
} 