package com.esprit.userAuth.controller;

import com.esprit.userAuth.entity.Certificate;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.exception.CertificateFraudException;
import com.esprit.userAuth.security.response.CertResponse;
import com.esprit.userAuth.security.response.MessageResponse;
import com.esprit.userAuth.service.CertificateService;
import com.esprit.userAuth.service.UserService;
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

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certs")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class CertificateController {
    @Autowired
    private CertificateService certService;

    @Autowired
    private UserService userService;

    @PostMapping("/upload/detection")
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("fromWhere") String fromWhere,
            Principal principal) {

        try {
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
    public ResponseEntity<CertResponse> uploadFile(
            @RequestParam("fromWhere") String fromWhere,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        String username = userDetails.getUsername();
        Certificate attachment = certService.saveCertificate(file, username, fromWhere);
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
}
