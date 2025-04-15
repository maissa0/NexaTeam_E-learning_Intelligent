package tn.esprit.nexaback.service.interfaces;

import java.util.List;
import java.util.Map;

import tn.esprit.nexaback.persistance.entities.Feedback;


public interface FeedbackService {
	List<Feedback> retrieveAllFeedbacksByCourse(Integer id);
	Feedback createFeedback(String feedbackText, Integer userId, Integer courseId, Integer emotion);
	void removeFeedback(Integer id);
	Feedback updateFeedback(Integer id,String feedbackText, Integer emotion);
	Feedback toggleLike(Integer feedbackId, Integer userId);
	double getAverageEmotionForCourse(Integer courseId);
	Map<Integer, Map<String, List<Feedback>>> getFeedbacksGroupedByCourse();

}
