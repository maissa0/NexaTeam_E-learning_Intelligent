package com.authentification.authentification.controller;

import com.authentification.authentification.config.JwtProvider;
import com.authentification.authentification.entity.Employee;
import com.authentification.authentification.entity.Role;
import com.authentification.authentification.entity.User;
import com.authentification.authentification.repo.EmployeeRepository;
import com.authentification.authentification.repo.UserRepository;
import com.authentification.authentification.request.LoginRequest;
import com.authentification.authentification.request.SignUpRequest;
import com.authentification.authentification.response.AuthResponse;
import com.authentification.authentification.service.CustomerUserServiceImplementation;
import jdk.jshell.spi.ExecutionControl;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.metadata.DataSourcePoolMetadataProvidersConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomerUserServiceImplementation customUserDetails;
    @Autowired
    private DataSourcePoolMetadataProvidersConfiguration dataSourcePoolMetadataProvidersConfiguration;

    @PostMapping("/signup/{role}")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignUpRequest signupRequest, @PathVariable String role) throws Exception {

        // Extract user and employee information from the request
        String email = signupRequest.getEmail();
        String password = signupRequest.getPassword();
        String name = signupRequest.getName();


        String employeeName = signupRequest.getEmployeeName();
        String employeeSurname = signupRequest.getEmployeeSurname();
        String employeeDateOfBirth = signupRequest.getEmployeeDateOfBirth();
        String employeeNumber = signupRequest.getEmployeeNumber();

        // Check if the email already exists
        User isEmailExists = userRepository.findByEmail(email);
        if (isEmailExists != null) {
            throw new Exception("Email already exists");
        }

        // Create new user
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setPassword(passwordEncoder.encode(password));
        createdUser.setName(name);
        createdUser.setRole(role);

        // Create new employee
        Employee createdEmployee = new Employee();
        createdEmployee.setNom(employeeName);
        createdEmployee.setPrenom(employeeSurname);
        createdEmployee.setDateDeNaissance(employeeDateOfBirth);
        createdEmployee.setNumero(employeeNumber);

        // Set the association between user and employee
        createdUser.setEmployee(createdEmployee);
        createdEmployee.setUser(createdUser);

        // Save both entities
        userRepository.save(createdUser);
        employeeRepository.save(createdEmployee);

        // Authenticate the user
        UserDetails userDetails = customUserDetails.loadUserByUsername(email);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate token using the generateToken method
        AuthResponse authResponse = JwtProvider.generateToken(authentication);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }






    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) throws Exception {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Authenticate the user
        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate token using the generateToken method
        AuthResponse authResponse = JwtProvider.generateToken(authentication);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }


    private Authentication authenticate(String email, String password) {

        UserDetails userDetails = customUserDetails.loadUserByUsername(email);

        System.out.println("sign in UserDetails: " + userDetails);

        if (userDetails == null) {
            System.out.println("sign in UserDetails - null"+ userDetails);
            throw new BadCredentialsException("invalid username or password");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {

            System.out.println("sign in userdetails - wrong password"+userDetails);
            throw new BadCredentialsException("invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
