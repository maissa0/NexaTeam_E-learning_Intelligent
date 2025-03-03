package com.esprit.userAuth.repositories;

import com.esprit.userAuth.entities.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CerticateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByOwnerUsername(String ownerUsername);
}
