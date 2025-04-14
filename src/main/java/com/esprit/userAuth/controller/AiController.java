package com.esprit.userAuth.controller;

import com.esprit.userAuth.service.AiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for AI-powered resume content generation
 * Provides endpoints for generating summaries, enhancing job descriptions, and suggesting skills
 */
@RestController
@RequestMapping("/api/ai/public")
@CrossOrigin(origins = "${frontend.url}")
public class AiController {
    private static final Logger logger = LoggerFactory.getLogger(AiController.class);
    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * Generates a professional summary for a resume based on job title only
     * @param request Map containing jobTitle
     * @return ResponseEntity with the generated summary or error message
     */
    @PostMapping("/generate-summary")
    public ResponseEntity<Map<String, String>> generateSummary(@RequestBody Map<String, Object> request) {
        try {
            String jobTitle = (String) request.get("jobTitle");
            
            if (jobTitle == null || jobTitle.trim().isEmpty()) {
                logger.warn("Invalid request for summary generation: missing jobTitle");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Job title is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create empty skills list if not provided
            @SuppressWarnings("unchecked")
            List<String> skills = request.get("skills") != null ? 
                                 (List<String>) request.get("skills") : 
                                 new ArrayList<>();
            
            logger.info("Generating summary for job title: {}", jobTitle);
            String summary = aiService.generateSummary(jobTitle, skills);
            
            Map<String, String> response = new HashMap<>();
            response.put("content", summary);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error generating summary: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error generating summary: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in generateSummary: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Enhances a job description to be more professional and impactful
     * @param request Map containing jobTitle, company, and description
     * @return ResponseEntity with the enhanced description or error message
     */
    @PostMapping("/enhance-description")
    public ResponseEntity<Map<String, String>> enhanceDescription(@RequestBody Map<String, String> request) {
        try {
            String jobTitle = request.get("jobTitle");
            String company = request.get("company");
            String description = request.get("description");
            
            if (jobTitle == null || company == null || description == null) {
                logger.warn("Invalid request for description enhancement: missing required fields");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Job title, company, and description are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (description.trim().isEmpty()) {
                logger.warn("Empty description provided for enhancement");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Description cannot be empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            logger.info("Enhancing job description for position: {} at {}", jobTitle, company);
            String enhancedDescription = aiService.enhanceJobDescription(jobTitle, company, description);
            
            Map<String, String> response = new HashMap<>();
            response.put("content", enhancedDescription);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error enhancing description: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error enhancing description: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in enhanceDescription: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Suggests relevant skills based on a job title
     * @param jobTitle The job title to suggest skills for
     * @return ResponseEntity with comma-separated list of skills or error message
     */
    @GetMapping("/suggest-skills")
    public ResponseEntity<Map<String, String>> suggestSkills(@RequestParam String jobTitle) {
        try {
            if (jobTitle == null || jobTitle.trim().isEmpty()) {
                logger.warn("Empty job title provided for skill suggestions");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Job title is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            logger.info("Suggesting skills for job title: {}", jobTitle);
            String skills = aiService.suggestSkills(jobTitle);
            
            Map<String, String> response = new HashMap<>();
            response.put("content", skills);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error suggesting skills: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error suggesting skills: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in suggestSkills: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 