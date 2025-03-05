package com.example.interview.service;

import com.example.interview.controllers.ZoomAuthController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    private static final Logger logger = LoggerFactory.getLogger(ZoomService.class);

    @Value("${zoom.api.url}")
    private String zoomApiUrl;

    @Value("${zoom.client.id}")
    private String clientId;

    @Value("${zoom.client.secret}")
    private String clientSecret;

    @Value("${zoom.token.url}")
    private String tokenUrl;

    private final ZoomAuthController zoomAuthController;

    public ZoomService(ZoomAuthController zoomAuthController) {
        this.zoomAuthController = zoomAuthController;
    }

    /**
     * Retrieves a new access token using the refresh token.
     */
    public String getValidAccessToken() {
        String refreshToken = zoomAuthController.getRefreshToken(); // Get latest stored refresh token

        if (refreshToken == null || refreshToken.isEmpty()) {
            logger.error("No valid refresh token available. Please reauthorize the app.");
            throw new RuntimeException("No valid refresh token. Please log in again.");
        }

        logger.info("Using Refresh Token: {}", refreshToken);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret); // Use Basic Auth with Client ID & Secret

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, Map.class);

            logger.info("Zoom Token Response Status: {}", response.getStatusCode());
            logger.info("Zoom Token Response Body: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.OK) {
                String newAccessToken = response.getBody().get("access_token").toString();
                String newRefreshToken = response.getBody().get("refresh_token").toString();

                logger.info("New Access Token: {}", newAccessToken);
                logger.info("New Refresh Token: {}", newRefreshToken);

                // Store new refresh token for future use
                zoomAuthController.setRefreshToken(newRefreshToken);

                return newAccessToken;
            } else {
                throw new RuntimeException("Failed to refresh Zoom access token: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error while retrieving Zoom access token", e);
            throw new RuntimeException("Error while retrieving Zoom access token", e);
        }
    }

    /**
     * Creates a Zoom meeting using a fresh access token.
     */
    public String createZoomMeeting(String scheduledDateTime) {
        String accessToken = getValidAccessToken(); // Get a valid access token before making API calls
        RestTemplate restTemplate = new RestTemplate();
        String createMeetingUrl = zoomApiUrl + "/users/me/meetings";

        logger.info("Creating Zoom meeting at: {}", scheduledDateTime);
        logger.info("Using Access Token: {}", accessToken);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("topic", "Interview Meeting");
        requestBody.put("type", 2); // Scheduled meeting
        requestBody.put("start_time", scheduledDateTime); // ISO 8601 format required
        requestBody.put("duration", 60); // Duration in minutes
        requestBody.put("timezone", "UTC");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken); // Use the valid access token

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        logger.info("Sending request to Zoom API: {}", requestBody);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(createMeetingUrl, HttpMethod.POST, entity, Map.class);

            logger.info("Zoom Response Status: {}", response.getStatusCode());
            logger.info("Zoom Response Body: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.CREATED) {
                return response.getBody().get("join_url").toString();
            } else {
                throw new RuntimeException("Failed to create Zoom meeting: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error while calling Zoom API", e);
            throw new RuntimeException("Error while calling Zoom API", e);
        }
    }
}
