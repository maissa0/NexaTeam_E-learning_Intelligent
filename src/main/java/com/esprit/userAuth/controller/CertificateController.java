package com.esprit.userAuth.controller;

import com.esprit.userAuth.entity.Certificate;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.exception.CertificateFraudException;
import com.esprit.userAuth.security.response.CertResponse;
import com.esprit.userAuth.security.response.MessageResponse;
import com.esprit.userAuth.service.CertificateService;
import com.esprit.userAuth.service.CertificateVerificationService;
import com.esprit.userAuth.service.PyTorchCertificateVerificationService;
import com.esprit.userAuth.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certs")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class CertificateController {
    private static final Logger logger = LoggerFactory.getLogger(CertificateController.class);

    @Autowired
    private CertificateService certService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private CertificateVerificationService certificateVerificationService;
    
    @Autowired
    private PyTorchCertificateVerificationService pyTorchVerificationService;

    // Helper method to determine which verification service to use
    private boolean verifyWithPreferredService(byte[] imageData) throws IOException {
        // Comment out ML verification
        /*
        // Try PyTorch first, fall back to TensorFlow if it fails
        try {
            if (!pyTorchVerificationService.isUsingMockImplementation()) {
                logger.info("Using PyTorch for certificate verification");
                return pyTorchVerificationService.isCertificateReal(imageData);
            }
        } catch (Exception e) {
            logger.warn("PyTorch verification failed, falling back to TensorFlow: {}", e.getMessage());
        }
        
        // Fallback to TensorFlow service
        logger.info("Using TensorFlow for certificate verification");
        return certificateVerificationService.isCertificateReal(imageData);
        */
        
        // Always return true (certificate is real)
        logger.info("ML verification disabled - assuming certificate is valid");
        return true;
    }

    @PostMapping("/upload/detection")
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("fromWhere") String fromWhere,
            Principal principal) {

        try {
            // First, verify the certificate using ML model
            byte[] imageData = file.getBytes();
            boolean isReal = true; // Force to true
            boolean usingMock = true; // Force to true
            
            /* Commented out ML verification
            try {
                isReal = certificateVerificationService.isCertificateReal(imageData);
            } catch (Exception e) {
                logger.error("Certificate verification failed: {}", e.getMessage());
                // If verification fails and we're in strict mode, reject the certificate
                if (!usingMock) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Certificate verification failed: " + e.getMessage());
                }
                // Otherwise, assume it's real and proceed (since we're in mock mode)
                isReal = true;
            }
            
            if (!isReal) {
                // Certificate is detected as fake/fraudulent
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("FRAUD ALERT: Certificate detected as potentially fraudulent and was not saved." +
                              (usingMock ? " (Using mock verification)" : ""));
            }
            */
            
            // Get current user
            User user = userService.findByUsername(principal.getName());

            // Store certificate
            Certificate certificate = certService.storeCertificate(file, title, fromWhere, user);

            return ResponseEntity.ok().body("Certificate uploaded successfully: " + certificate.getId());
        } catch (CertificateFraudException e) {
            // Special handling for fraudulent certificates
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("FRAUD ALERT: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body("Could not upload certificate: " + e.getMessage());
        }
    }


    /**
     * Upload a certificate
     * @param fromWhere Where the certificate is from
     * @param file The certificate file
     * @param userDetails The authenticated user
     * @return The response with the certificate details
     * @throws Exception If an error occurs
     */


    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam(value = "fromWhere", required = true) String fromWhere,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) throws Exception {
        
        // Enhanced detailed logging of the entire request
        logger.info("================ CERTIFICATE UPLOAD REQUEST DEBUG INFO ================");
        logger.info("Request URI: {}", request.getRequestURI());
        logger.info("Content type: {}", request.getContentType());
        logger.info("Content length: {}", request.getContentLength());
        
        // Log headers
        logger.info("--- Request Headers ---");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            logger.info("{}: {}", headerName, request.getHeader(headerName));
        }
        
        // Log parameters
        logger.info("--- Request Parameters ---");
        java.util.Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            logger.info("{}: {}", paramName, request.getParameter(paramName));
        }
        
        // Log received parameters
        logger.info("--- Received Parameters ---");
        logger.info("fromWhere: {}", fromWhere);
        logger.info("name: {}", name);
        logger.info("file: {} ({})", file.getOriginalFilename(), file.getContentType());
        logger.info("file size: {} bytes", file.getSize());
        logger.info("file isEmpty: {}", file.isEmpty());
        logger.info("User: {}", userDetails.getUsername());
        logger.info("====================================================================");
        
        String username = userDetails.getUsername();
        
        // Validate parameters
        if (fromWhere == null || fromWhere.trim().isEmpty()) {
            logger.warn("Missing required parameter 'fromWhere' in certificate upload");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Required parameter 'fromWhere' is missing or empty"));
        }
        
        if (file == null || file.isEmpty()) {
            logger.warn("Missing required file in certificate upload");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Certificate file is required"));
        }
        
        try {
            // First, verify the certificate using ML model
            byte[] imageData = file.getBytes();
            boolean isReal = true; // Force to true
            boolean usingMock = true; // Force to true
            
            /* Commented out ML verification
            try {
                isReal = certificateVerificationService.isCertificateReal(imageData);
            } catch (Exception e) {
                logger.error("Certificate verification failed: {}", e.getMessage());
                // If verification fails and we're in strict mode, reject the certificate
                if (!usingMock) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Certificate verification failed: " + e.getMessage()));
                }
                // Otherwise, assume it's real and proceed (since we're in mock mode)
                isReal = true;
            }
            
            if (!isReal) {
                // Certificate is detected as fake/fraudulent
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("FRAUD ALERT: Certificate detected as potentially fraudulent and was not saved." +
                                                  (usingMock ? " (Using mock verification)" : "")));
            }
            */
            
            // Certificate is real, proceed with saving
            // If name is provided, use it as title, otherwise use original filename
            Certificate attachment;
            if (name != null && !name.trim().isEmpty()) {
                // Create a copy of the file with a custom name
                attachment = certService.saveCertificateWithCustomName(file, username, fromWhere, name);
            } else {
                attachment = certService.saveCertificate(file, username, fromWhere);
            }
            
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/certs/download/")
                    .path(attachment.getId())
                    .toUriString();

            return ResponseEntity.ok(new CertResponse(
                    attachment.getTitle(),
                    downloadUrl,
                    file.getContentType(),
                    file.getSize()
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(new MessageResponse("Could not process certificate: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing certificate: " + e.getMessage()));
        }
    }

    /**
     * Download a certificate
     * @param fileId The ID of the certificate
     * @return The certificate file
     * @throws Exception If the certificate is not found
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) throws Exception {
        Certificate attachment = certService.getCertificate(fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getTitle() + "\"")
                .body(new ByteArrayResource(attachment.getData()));
    }
    
    /**
     * Get all certificates for the authenticated user
     * @param userDetails The authenticated user
     * @return The list of certificates
     */
    @GetMapping
    public ResponseEntity<List<CertResponse>> getUserCertificates(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<Certificate> certificates = certService.getCertificatesForUser(username);
        
        List<CertResponse> responses = certificates.stream()
                .map(cert -> {
                    String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/api/certs/download/")
                            .path(cert.getId())
                            .toUriString();
                    
                    return new CertResponse(
                            cert.getTitle(),
                            downloadUrl,
                            cert.getFileType(),
                            cert.getData().length
                    );
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Delete a certificate
     * @param fileId The ID of the certificate
     * @param userDetails The authenticated user
     * @return A success message or an error message
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteCertificate(
            @PathVariable String fileId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        boolean deleted = certService.deleteCertificate(fileId, username);
        
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Certificate deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Certificate not found or you don't have permission to delete it"));
        }
    }
    
    /**
     * Update certificate information
     * @param fileId The ID of the certificate
     * @param fromWhere The new "from where" value
     * @param userDetails The authenticated user
     * @return The updated certificate
     * @throws Exception If the certificate is not found or the user doesn't have permission
     */
    @PutMapping("/{fileId}")
    public ResponseEntity<?> updateCertificateInfo(
            @PathVariable String fileId,
            @RequestParam("fromWhere") String fromWhere,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            Certificate updatedCert = certService.updateCertificateInfo(fileId, fromWhere, username);
            
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/certs/download/")
                    .path(updatedCert.getId())
                    .toUriString();
            
            return ResponseEntity.ok(new CertResponse(
                    updatedCert.getTitle(),
                    downloadUrl,
                    updatedCert.getFileType(),
                    updatedCert.getData().length
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * Get a certificate by ID
     * @param fileId The ID of the certificate
     * @return The certificate details
     * @throws Exception If the certificate is not found
     */
    @GetMapping("/{fileId}")
    public ResponseEntity<CertResponse> getCertificateById(@PathVariable String fileId) {
        try {
            Certificate cert = certService.getCertificate(fileId);
            
            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/certs/download/")
                    .path(cert.getId())
                    .toUriString();
            
            return ResponseEntity.ok(new CertResponse(
                    cert.getTitle(),
                    downloadUrl,
                    cert.getFileType(),
                    cert.getData().length
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/verify-test")
    public ResponseEntity<?> verifyTest(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to byte array
            byte[] imageData = file.getBytes();
            
            // Force results to true/valid
            boolean pyTorchResult = true;
            boolean tensorFlowResult = true;
            boolean usingMockTf = true;
            boolean usingMockPt = true;
            
            /* Commented out ML verification logic
            // Get verification results from both models
            boolean pyTorchResult = pyTorchVerificationService.isCertificateReal(imageData);
            boolean usingMockPt = pyTorchVerificationService.isUsingMockImplementation();
            
            // Check TensorFlow result
            boolean tensorFlowResult = certificateVerificationService.isCertificateReal(imageData);
            boolean usingMockTf = certificateVerificationService.isUsingMockImplementation();
            */
            
            Map<String, Object> response = new HashMap<>();
            
            // TensorFlow Result (commented out)
            /*
            long tfStartTime = System.nanoTime();
            boolean tfResult = certificateVerificationService.isCertificateReal(imageData);
            long tfEndTime = System.nanoTime();
            double tfTimeMs = (tfEndTime - tfStartTime) / 1_000_000.0;
            boolean tfUsingMock = certificateVerificationService.isUsingMockImplementation();
            
            response.put("tensorflowResult", Map.of(
                "isReal", tfResult,
                "processingTimeMs", tfTimeMs,
                "usingMockImplementation", tfUsingMock
            ));
            */
            
            // Always return true for TensorFlow
            response.put("tensorflowResult", Map.of(
                "isReal", true,
                "processingTimeMs", 0.0,
                "usingMockImplementation", true
            ));
            
            // PyTorch Result (commented out)
            /*
            long ptStartTime = System.nanoTime();
            boolean ptResult = pyTorchVerificationService.isCertificateReal(imageData);
            long ptEndTime = System.nanoTime();
            double ptTimeMs = (ptEndTime - ptStartTime) / 1_000_000.0;
            boolean ptUsingMock = pyTorchVerificationService.isUsingMockImplementation();
            
            response.put("pytorchResult", Map.of(
                "isReal", ptResult,
                "processingTimeMs", ptTimeMs,
                "usingMockImplementation", ptUsingMock
            ));
            */
            
            // Always return true for PyTorch
            response.put("pytorchResult", Map.of(
                "isReal", true,
                "processingTimeMs", 0.0,
                "usingMockImplementation", true
            ));
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error reading certificate file: " + e.getMessage()));
        }
    }
    
    // Let's add a new endpoint to compare both models
    @PostMapping("/verify-compare")
    public ResponseEntity<?> verifyCompare(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> response = new HashMap<>();
            byte[] imageData = file.getBytes();
            
            // TensorFlow Result (commented out)
            /*
            long tfStartTime = System.nanoTime();
            boolean tfResult = certificateVerificationService.isCertificateReal(imageData);
            long tfEndTime = System.nanoTime();
            double tfTimeMs = (tfEndTime - tfStartTime) / 1_000_000.0;
            boolean tfUsingMock = certificateVerificationService.isUsingMockImplementation();
            
            response.put("tensorflowResult", Map.of(
                "isReal", tfResult,
                "processingTimeMs", tfTimeMs,
                "usingMockImplementation", tfUsingMock
            ));
            */
            
            // Always return true for TensorFlow
            response.put("tensorflowResult", Map.of(
                "isReal", true,
                "processingTimeMs", 0.0,
                "usingMockImplementation", true
            ));
            
            // PyTorch Result (commented out)
            /*
            long ptStartTime = System.nanoTime();
            boolean ptResult = pyTorchVerificationService.isCertificateReal(imageData);
            long ptEndTime = System.nanoTime();
            double ptTimeMs = (ptEndTime - ptStartTime) / 1_000_000.0;
            boolean ptUsingMock = pyTorchVerificationService.isUsingMockImplementation();
            
            response.put("pytorchResult", Map.of(
                "isReal", ptResult,
                "processingTimeMs", ptTimeMs,
                "usingMockImplementation", ptUsingMock
            ));
            */
            
            // Always return true for PyTorch
            response.put("pytorchResult", Map.of(
                "isReal", true,
                "processingTimeMs", 0.0,
                "usingMockImplementation", true
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error reading certificate file: " + e.getMessage()));
        }
    }
}
