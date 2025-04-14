package com.esprit.userAuth.repository;

import com.esprit.userAuth.entity.AppRole;
import com.esprit.userAuth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);

}