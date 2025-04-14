package com.esprit.userAuth.repository;


import com.esprit.userAuth.entity.Company;
import com.esprit.userAuth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String username);

    Boolean existsByUserName(String username);
    Boolean existsByEmail(String email);


    Optional<User> findByEmail(String email);
    
    // Find all users associated with a specific company
    List<User> findByCompany(Company company);
}
