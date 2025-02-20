package com.authentification.authentification.repo;

import com.authentification.authentification.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

    Optional<Employee> findByNomAndPrenom(String nom, String prenom);
}
