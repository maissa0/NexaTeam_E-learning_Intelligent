package tn.esprit.nexaback.service.classes;

import org.springframework.http.HttpHeaders;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SentimentAnalysisService {
    private final String FLASK_API_URL = "http://localhost:5000/analyze";

    public int analyzeSentiment(String feedbackText) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = Map.of("text", feedbackText);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, entity, Map.class);
        
        return response.getBody() != null ? (int) response.getBody().get("emotion") : 3;
    }
}