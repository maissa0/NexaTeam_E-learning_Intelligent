package tn.esprit.nexaback.persistance.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.nexaback.persistance.entities.Feedback;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
	 List<Feedback> findByCoursId(Integer courseId);
}
