package com.example.evaluationform.service;

import com.example.evaluationform.model.JobOfferRequest;
import com.example.evaluationform.model.OllamaRawResponse;
import com.example.evaluationform.model.QuestionReponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiInterviewService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<QuestionReponse> generateQuestions(JobOfferRequest request) {
        String prompt = buildPrompt(request);
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "mistral");
        payload.put("prompt", prompt);
        payload.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<OllamaRawResponse> response = restTemplate.postForEntity(
                "http://localhost:11434/api/generate",
                entity,
                OllamaRawResponse.class
        );

        String responseString = response.getBody().getResponse();

        try {
            // Parse the embedded JSON array string
            List<QuestionReponse> questions = objectMapper.readValue(
                    responseString,
                    new TypeReference<List<QuestionReponse>>() {}
            );

            // Set default mark
            questions.forEach(q -> q.setMark(null));
            return questions;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private String buildPrompt(JobOfferRequest request) {
        return String.format("""
            You are an expert technical interviewer.
            Generate 10 interview questions for the following role:
            Job Title: %s
            Description: %s
            Required Skills: %s
            Return the questions in JSON array format with fields: 'category' and 'question'.
            """,
                request.getTitle(),
                request.getDescription(),
                String.join(", ", request.getRequiredSkills()));
    }
}

