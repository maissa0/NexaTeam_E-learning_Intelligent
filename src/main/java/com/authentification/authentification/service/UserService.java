package com.authentification.authentification.service;

import com.authentification.authentification.entity.User;

import java.util.List;

public interface UserService {

    public User getUserProfile(String jwt);
    public List<User> getAllUsers();
    long countAllEtudiants();
}
