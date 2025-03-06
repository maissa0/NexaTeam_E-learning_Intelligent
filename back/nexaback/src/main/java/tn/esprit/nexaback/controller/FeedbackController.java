package tn.esprit.nexaback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.nexaback.persistance.entities.Feedback;
import tn.esprit.nexaback.persistance.entities.FeedbackRequest;
import tn.esprit.nexaback.service.interfaces.FeedbackService;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByCourse(@PathVariable("courseId") Integer courseId) {
        List<Feedback> feedbacks = feedbackService.retrieveAllFeedbacksByCourse(courseId);
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping("/")
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackRequest feedbackRequest) {
        Feedback feedback = feedbackService.createFeedback(feedbackRequest.getFeedbackText(), feedbackRequest.getUserId(), feedbackRequest.getCourseId(), feedbackRequest.getEmotion());
        return ResponseEntity.ok(feedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable("id") Integer feedbackId) {
        feedbackService.removeFeedback(feedbackId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable("id") Integer id,
            @RequestParam("feedbackText") String feedbackText,
            @RequestParam("emotion") Integer emotion,
            @RequestParam("nbrReaction") Integer nbrReaction) {
        
        Feedback updatedFeedback = feedbackService.updateFeedback(id, feedbackText, emotion);
        return ResponseEntity.ok(updatedFeedback);
    }
    @PutMapping("/{feedbackId}/like/{userId}")
    public ResponseEntity<Feedback> toggleLike(
            @PathVariable("feedbackId") Integer feedbackId,
            @PathVariable("userId") Integer userId) {
        
        Feedback updatedFeedback = feedbackService.toggleLike(feedbackId, userId);
        return ResponseEntity.ok(updatedFeedback);
    }
    @GetMapping("/{courseId}/average-emotion")
    public ResponseEntity<Double> getAverageEmotion(@PathVariable("courseId") Integer courseId) {
        double averageEmotion = feedbackService.getAverageEmotionForCourse(courseId);
        return ResponseEntity.ok(averageEmotion);
    }
    @GetMapping("/groupedByCourse")
    public ResponseEntity<Map<Integer, Map<String, List<Feedback>>>> getFeedbacksGroupedByCourse() {
    	Map<Integer, Map<String, List<Feedback>>> feedbacksByCourse = feedbackService.getFeedbacksGroupedByCourse();
        return ResponseEntity.ok(feedbacksByCourse);
    }

}
