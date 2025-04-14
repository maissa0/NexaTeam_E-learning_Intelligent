package com.esprit.userAuth.controller;

import com.esprit.userAuth.dtos.EmployeeCreationDTO;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.security.response.MessageResponse;
import com.esprit.userAuth.service.UserService;
import com.esprit.userAuth.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class CompanyUserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthUtil authUtil;
    
    /**
     * Endpoint for company users to add employees
     */
    @PostMapping("/employees/add")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody EmployeeCreationDTO employeeDTO) {
        try {
            // Get the current authenticated company user
            User companyUser = authUtil.loggedInUser();
            
            // Check if the user has a company
            if (companyUser.getCompany() == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: You are not associated with any company"));
            }
            
            // Create the employee user
            User employeeUser = userService.createEmployeeUser(
                employeeDTO.getUsername(),
                employeeDTO.getEmail(),
                employeeDTO.getFirstName(),
                employeeDTO.getLastName(),
                companyUser.getCompany().getId()
                //employeeDTO.getPosition(),
                //employeeDTO.getDepartment()
            );
            
            return ResponseEntity.ok(new MessageResponse("Employee added successfully. Credentials have been sent to the employee's email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Endpoint for company users to get all their employees
     */
    @GetMapping("/employees")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getCompanyEmployees() {
        try {
            // Get the current authenticated company user
            User companyUser = authUtil.loggedInUser();
            
            // Check if the user has a company
            if (companyUser.getCompany() == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: You are not associated with any company"));
            }
            
            // Get all users with the company ID
            List<User> allUsers = userService.getAllUsers();
            
            // Filter users by company ID and ROLE_EMPLOYEE
            List<User> employees = allUsers.stream()
                .filter(user -> user.getCompany() != null && 
                       user.getCompany().getId().equals(companyUser.getCompany().getId()) &&
                       user.getRole() != null && 
                       user.getRole().getRoleName().name().equals("ROLE_EMPLOYEE"))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Endpoint for company users to get a specific employee by ID
     */
    @GetMapping("/employees/{employeeId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long employeeId) {
        try {
            // Get the current authenticated company user
            User companyUser = authUtil.loggedInUser();
            
            // Check if the user has a company
            if (companyUser.getCompany() == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: You are not associated with any company"));
            }
            
            // Get the employee
            User employee = userService.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
            
            // Check if the employee belongs to the company
            if (employee.getCompany() == null || 
                !employee.getCompany().getId().equals(companyUser.getCompany().getId()) ||
                employee.getRole() == null || 
                !employee.getRole().getRoleName().name().equals("ROLE_EMPLOYEE")) {
                
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Employee not found or not associated with your company"));
            }
            
            return ResponseEntity.ok(employee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
} 