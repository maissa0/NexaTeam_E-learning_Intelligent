package com.esprit.userAuth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${google.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public AiService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Generates resume content using Google's Gemini AI model via REST API
     * 
     * @param prompt The prompt to generate content for
     * @return The generated content
     */
    public String generateContent(String prompt) throws IOException {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contents = new HashMap<>();
            contents.put("role", "user");
            contents.put("parts", new Object[]{Map.of("text", prompt)});
            requestBody.put("contents", new Object[]{contents});
            
            // Create the HTTP entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // Make the request with API key as query parameter
            String url = GEMINI_API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            
            // Extract the text from the response
            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                
                // Handle Gemini 1.5 response format which might use candidates as a Map instead of List
                Object candidatesObj = responseBody.get("candidates");
                
                if (candidatesObj != null) {
                    Map<String, Object> candidate;
                    
                    if (candidatesObj instanceof List) {
                        // Original format: candidates is a list
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) candidatesObj;
                        if (candidates.isEmpty()) {
                            throw new IOException("Empty candidates list in response");
                        }
                        candidate = candidates.get(0);
                    } else if (candidatesObj instanceof Map) {
                        // New format: candidates is a map
                        candidate = (Map<String, Object>) candidatesObj;
                    } else {
                        throw new IOException("Unexpected candidates type: " + candidatesObj.getClass().getName());
                    }
                    
                    // Handle content which could be a List or Map
                    Object contentObj = candidate.get("content");
                    Map<String, Object> content;
                    
                    if (contentObj instanceof List) {
                        // Original format: content is a list
                        List<Map<String, Object>> contentList = (List<Map<String, Object>>) contentObj;
                        if (contentList.isEmpty()) {
                            throw new IOException("Empty content list in response");
                        }
                        content = contentList.get(0);
                    } else if (contentObj instanceof Map) {
                        // New format: content is a map
                        content = (Map<String, Object>) contentObj;
                    } else {
                        throw new IOException("Unexpected content type: " + contentObj.getClass().getName());
                    }
                    
                    // Handle parts which could be a List or Map
                    Object partsObj = content.get("parts");
                    
                    if (partsObj instanceof List) {
                        // Original format: parts is a list
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) partsObj;
                        if (!parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    } else if (partsObj instanceof Map) {
                        // New format: parts is a map
                        Map<String, Object> parts = (Map<String, Object>) partsObj;
                        return (String) parts.get("text");
                    }
                }
            }
            
            throw new IOException("Failed to extract text from Gemini API response");
        } catch (Exception e) {
            throw new IOException("Error calling Gemini API: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generates a professional summary based on job title and skills
     * 
     * @param jobTitle The job title
     * @param skills A list of skills
     * @return A professionally written summary
     */
    public String generateSummary(String jobTitle, List<String> skills) throws IOException {
        String prompt = String.format(
            "Write a professional summary for a resume of a %s. Include these skills: %s. " +
            "The summary should be 3-4 sentences, highlighting expertise and value proposition. " +
            "Make it compelling and professional. Do not use bullet points.",
            jobTitle, String.join(", ", skills)
        );
        
        return generateContent(prompt);
    }
    
    /**
     * Enhances a job description to make it more professional and impactful
     * 
     * @param jobTitle The job title
     * @param company The company name
     * @param description The original description
     * @return An enhanced job description
     */
    public String enhanceJobDescription(String jobTitle, String company, String description) throws IOException {
        String prompt = String.format(
            "Enhance this job description for a %s position at %s to make it more professional and impactful " +
            "for a resume. Focus on achievements and responsibilities. Original description: %s",
            jobTitle, company, description
        );
        
        return generateContent(prompt);
    }
    
    /**
     * Suggests skills based on a job title
     * 
     * @param jobTitle The job title
     * @return A list of relevant skills as a comma-separated string
     */
    public String suggestSkills(String jobTitle) throws IOException {
        String prompt = String.format(
            "List 10 relevant technical and soft skills for a %s role. " +
            "Format as a comma-separated list without numbering or bullet points.",
            jobTitle
        );
        
        return generateContent(prompt);
    }
} 