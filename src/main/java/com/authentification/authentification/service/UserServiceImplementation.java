package com.authentification.authentification.service;

import com.authentification.authentification.config.JwtProvider;
import com.authentification.authentification.entity.User;
import com.authentification.authentification.repo.EmployeeRepository;
import com.authentification.authentification.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserServiceImplementation implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public User getUserProfile(String jwt) {
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public long countAllEtudiants() {
        return employeeRepository.count();
    }
}
