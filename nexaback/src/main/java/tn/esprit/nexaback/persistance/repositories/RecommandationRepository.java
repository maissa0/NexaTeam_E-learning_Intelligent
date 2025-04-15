package tn.esprit.nexaback.persistance.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.esprit.nexaback.persistance.entities.Recommandation;
import java.util.List;
import java.util.Optional;

public interface RecommandationRepository extends JpaRepository<Recommandation, Integer>{
    List<Recommandation> findByUserId(Integer userId);
    Optional<Recommandation> findByUserIdAndCoursId(Integer userId, Integer courseId);
}
