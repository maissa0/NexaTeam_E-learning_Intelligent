package com.authentification.authentification.controller;


import com.authentification.authentification.config.JwtProvider;
import com.authentification.authentification.entity.Employee;
import com.authentification.authentification.entity.User;
import com.authentification.authentification.repo.EmployeeRepository;
import com.authentification.authentification.repo.UserRepository;
import com.authentification.authentification.request.EmailRequest;
import com.authentification.authentification.request.SignUpRequest;
import com.authentification.authentification.service.UserService;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
    private  UserService userService;

    @Autowired
    EmployeeRepository employeeRepository;


    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile/debut")
    public ResponseEntity<User> getUserProfile1 (@RequestHeader("Authorization") String jwt){
        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestHeader("Authorization") String jwt) {
        // Extract email from JWT token
        String email = JwtProvider.getEmailFromJwtToken(jwt); // Remove 'Bearer ' part
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Get employee info
        Employee employee = user.getEmployee();
        if (employee == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Prepare the response data (both user and employee details)
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        responseData.put("employee", employee);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Update user and employee info
    @PutMapping("/update")
    public ResponseEntity<String> updateUserAndEmployee(@RequestHeader("Authorization") String jwt,
                                                        @RequestBody SignUpRequest updateRequest) {
        // Extract email from JWT token
        String email = JwtProvider.getEmailFromJwtToken(jwt); // Remove 'Bearer ' part
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // Update user information, except role and password
        user.setName(updateRequest.getName());

        // Update employee information
        Employee employee = user.getEmployee();
        if (employee != null) {
            employee.setNom(updateRequest.getEmployeeName());
            employee.setPrenom(updateRequest.getEmployeeSurname());
            employee.setDateDeNaissance(updateRequest.getEmployeeDateOfBirth());
            employee.setNumero(updateRequest.getEmployeeNumber());
        } else {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }

        // Save updated user and employee
        userRepository.save(user);
        employeeRepository.save(employee);

        return new ResponseEntity<>("User and employee information updated successfully", HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<User>> getUsers (@RequestHeader("Authorization") String jwt){
        List<User> user = userService.getAllUsers();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PostMapping("/by-email")
    public ResponseEntity<Employee> getEmployeeByEmail(@RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Employee employee = user.getEmployee();
        if (employee == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found for the given user");
        }

        return ResponseEntity.ok(employee);
    }

    @GetMapping("/emailJWT")
    public String getEmailFromJwt(@RequestHeader("Authorization") String token) {
        return JwtProvider.getEmailFromJwtToken(token);
    }

    @PostMapping("/by-email2")
    public User getUserByEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return user;
    }

    @GetMapping("/count/all")
    public ResponseEntity<Long> countAllEmployees() {
        long count = userService.countAllEtudiants();
        return ResponseEntity.ok(count);
    }


    @GetMapping("/all-users-employees")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersWithEmployees() {
        // Fetch all users from the repository
        List<User> users = userRepository.findAll();

        // Prepare a list to store user and employee information
        List<Map<String, Object>> userEmployeeData = new ArrayList<>();

        // Iterate over users to fetch their corresponding employee info
        for (User user : users) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("user", user);

            Employee employee = user.getEmployee();
            if (employee != null) {
                userData.put("employee", employee);
            } else {
                userData.put("employee", "No employee information available");
            }

            userEmployeeData.add(userData);
        }

        // Return the list of user and employee data
        return new ResponseEntity<>(userEmployeeData, HttpStatus.OK);
    }

}
