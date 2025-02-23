package com.example.quizapp.Repo;

import com.example.quizapp.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
