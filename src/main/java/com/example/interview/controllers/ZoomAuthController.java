package com.example.interview.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.Map;

@RestController
@RequestMapping("/oauth")
public class ZoomAuthController {

    private static final Logger logger = LoggerFactory.getLogger(ZoomAuthController.class);

    @Value("${zoom.client.id}")
    private String clientId;

    @Value("${zoom.client.secret}")
    private String clientSecret;

    @Value("${zoom.redirect.uri}")
    private String redirectUri;

    @Value("${zoom.token.url}")
    private String tokenUrl;

    private String refreshToken; // Temporary storage, replace with database in production

    /**
     * Redirects the user to Zoom for authorization.
     */
    @GetMapping("/login")
    public ResponseEntity<String> redirectToZoom() {
        String zoomAuthLink = "https://zoom.us/oauth/authorize"
                + "?response_type=code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri;

        return ResponseEntity.ok("Click to authorize: <a href=\"" + zoomAuthLink + "\">Login with Zoom</a>");
    }

    /**
     * Handles the callback from Zoom after user authorization.
     */
    @GetMapping("/callback")
    public ResponseEntity<String> handleZoomCallback(@RequestParam("code") String code) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret); // Sends Client ID and Secret in Basic Auth

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("code", code);
        requestBody.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                String accessToken = responseBody.get("access_token").toString();
                this.refreshToken = responseBody.get("refresh_token").toString(); // Store refresh token

                logger.info("Successfully retrieved access token from Zoom.");
                logger.info("Access Token: {}", accessToken);
                logger.info("Refresh Token: {}", refreshToken);

                return ResponseEntity.ok("Authorization successful! You can now create meetings. "
                        + "<br> Access Token: " + accessToken
                        + "<br> Refresh Token: " + refreshToken);
            } else {
                logger.error("Failed to retrieve Zoom access token. Status: {}", response.getStatusCode());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error retrieving access token.");
            }
        } catch (Exception e) {
            logger.error("Error while handling Zoom callback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing the request.");
        }
    }

    /**
     * Returns the stored refresh token.
     */
    public String getRefreshToken() {
        if (refreshToken == null || refreshToken.isEmpty()) {
            logger.error("No valid refresh token found. User must reauthorize.");
            throw new RuntimeException("No valid refresh token available. Please log in again.");
        }
        return refreshToken;
    }

    /**
     * Updates the refresh token when a new one is received.
     */
    public void setRefreshToken(String newRefreshToken) {
        this.refreshToken = newRefreshToken;
        logger.info("Updated refresh token: {}", newRefreshToken);
    }
}

