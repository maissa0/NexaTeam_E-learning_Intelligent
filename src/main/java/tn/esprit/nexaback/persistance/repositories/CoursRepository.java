package tn.esprit.nexaback.persistance.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.esprit.nexaback.persistance.entities.Cours;

public interface CoursRepository extends JpaRepository<Cours, Integer>{

}
