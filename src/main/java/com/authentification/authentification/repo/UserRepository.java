package com.authentification.authentification.repo;

import com.authentification.authentification.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Integer> {

    public User findByEmail(String email);
    List<User> findAll();
}
