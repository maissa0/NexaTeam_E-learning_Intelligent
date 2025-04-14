package com.esprit.userAuth.repository;

import com.esprit.userAuth.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByName(String name);
    boolean existsByEmailCompany(String email);
    Optional<Company> findByName(String name);
    Optional<Company> findByEmailCompany(String email);
} 