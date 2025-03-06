package tn.esprit.nexaback.service.interfaces;

import java.util.List;

import tn.esprit.nexaback.persistance.entities.Cours;
import tn.esprit.nexaback.persistance.entities.Recommandation;


public interface RecommandationService {
	List<Recommandation> retrieveAllRecommandationsByUser(Integer id);
    Recommandation createRecommandation(Integer userId, Integer courseId, Integer engagement);
	void removeRecommandation(Integer id);
	List<Cours> recommendCoursesByTitle(Integer id);
}
