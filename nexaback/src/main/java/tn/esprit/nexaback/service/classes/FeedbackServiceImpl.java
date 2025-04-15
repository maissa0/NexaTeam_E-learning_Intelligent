package tn.esprit.nexaback.service.classes;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import tn.esprit.nexaback.persistance.entities.Cours;
import tn.esprit.nexaback.persistance.entities.Feedback;
import tn.esprit.nexaback.persistance.entities.User;
import tn.esprit.nexaback.persistance.repositories.CoursRepository;
import tn.esprit.nexaback.persistance.repositories.FeedbackRepository;
import tn.esprit.nexaback.persistance.repositories.UserRepository;
import tn.esprit.nexaback.service.interfaces.FeedbackService;

@Service
public class FeedbackServiceImpl implements FeedbackService{
    private final String FLASK_API_URL = "http://localhost:5000/analyze";

	@Autowired
	private FeedbackRepository feedRep;
	
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CoursRepository coursRepository;
    
	@Override
	public List<Feedback> retrieveAllFeedbacksByCourse(Integer id) {
		return feedRep.findByCoursId(id);
	}

	@Override
	public double getAverageEmotionForCourse(Integer courseId) {
	    List<Feedback> feedbacks = feedRep.findByCoursId(courseId);

	    if (feedbacks.isEmpty()) {
	        return 0.0;
	    }

	    double sumOfEmotions = 0;
	    for (Feedback feedback : feedbacks) {
	        sumOfEmotions += feedback.getEmotion();
	    }

	    return sumOfEmotions / feedbacks.size();
	}

	@Override
    public Feedback createFeedback(String feedbackText, Integer userId, Integer courseId, Integer emotion) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Optional<Cours> coursOpt = coursRepository.findById(courseId);
        if (coursOpt.isEmpty()) {
            throw new RuntimeException("Course not found");
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = Map.of("text", feedbackText);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, entity, Map.class);
        Integer analyzedEmotion = (Integer) response.getBody().get("emotion");

        Feedback feedback = new Feedback();
        feedback.setFeedback(feedbackText);
        feedback.setEmotion(analyzedEmotion);      
        feedback.setDateDeCreation(new Date());
        feedback.setUser(userOpt.get());
        feedback.setCours(coursOpt.get());

        return feedRep.save(feedback);
    }
	@Override
    public Map<Integer, Map<String, List<Feedback>>>getFeedbacksGroupedByCourse() {
	    List<Feedback> feedbacks = feedRep.findAll();
        return feedbacks.stream()
                .collect(Collectors.groupingBy(
                        f -> f.getCours().getId(), 
                        Collectors.groupingBy(f -> f.getCours().getSujet()) 
                ));
    }
	@Override
	public void removeFeedback(Integer id) {
		feedRep.deleteById(id);
	}

	@Override
	public Feedback updateFeedback(Integer id, String feedbackText, Integer emotion) {
		   Optional<Feedback> existingFeedback = feedRep.findById(id);

	        if (existingFeedback.isPresent()) {
	            Feedback feedback = existingFeedback.get();
	            feedback.setFeedback(feedbackText);
	            feedback.setEmotion(emotion);
	            return feedRep.save(feedback);
	        } else {
	            throw new RuntimeException("Feedback not found with ID: " + id);
	        }
	    }
	 @Override
	    public Feedback toggleLike(Integer feedbackId, Integer userId) {
	        Optional<Feedback> feedbackOpt = feedRep.findById(feedbackId);
	        Optional<User> userOpt = userRepository.findById(userId);

	        if (feedbackOpt.isPresent() && userOpt.isPresent()) {
	            Feedback feedback = feedbackOpt.get();
	            User user = userOpt.get();
	            Set<User> likedUsers = feedback.getLikedByUsers();

	            if (likedUsers == null) {
	                likedUsers = new HashSet<>();
	            }

	            if (likedUsers.contains(user)) {
	                likedUsers.remove(user); // Unlike
	            } else {
	                likedUsers.add(user); // Like
	            }

	            feedback.setLikedByUsers(likedUsers);
	            return feedRep.save(feedback);
	        } else {
	            throw new RuntimeException("Feedback or User not found.");
	        }
	    }

}
