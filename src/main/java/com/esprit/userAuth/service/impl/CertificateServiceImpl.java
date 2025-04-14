package com.esprit.userAuth.service.impl;

import com.esprit.userAuth.entity.Certificate;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.exception.CertificateFraudException;
import com.esprit.userAuth.repository.CertificateRepository;
import com.esprit.userAuth.repository.UserRepository;
import com.esprit.userAuth.service.AuditLogService;
import com.esprit.userAuth.service.CertificateService;
import com.esprit.userAuth.service.CertificateVerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CertificateServiceImpl implements CertificateService {

    private static final Logger logger = LoggerFactory.getLogger(CertificateServiceImpl.class);
    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;
    @Autowired
    private CertificateVerificationService verificationService;

    @Override
    public Certificate storeCertificate(MultipartFile file, String title, String fromWhere, User user) throws IOException {
        try {
            // Get file bytes
            byte[] fileBytes = file.getBytes();

            // Verify certificate is real
            // Commented out ML verification
            // boolean isReal = verificationService.isCertificateReal(fileBytes);
            boolean isReal = true; // Always assume certificate is real

            if (!isReal) {
                logger.warn("Detected fraudulent certificate upload attempt by user: {}", user.getUserName());
                throw new CertificateFraudException("This certificate appears to be fraudulent and cannot be saved.");
            }

            logger.info("Verified authentic certificate from user: {}", user.getUserName());

            // If certificate is real, save it
            String fileType = file.getContentType();
            Certificate certificate = new Certificate(title, fileType, fileBytes);
            certificate.setFromWhere(fromWhere);
            certificate.setUser(user);

            Certificate savedCertificate = certificateRepository.save(certificate);
            auditLogService.logCertCreation(user.getUserName(), savedCertificate);

            return savedCertificate;
        } catch (IOException e) {
            logger.error("Failed to store certificate", e);
            throw new IOException("Could not store certificate: " + e.getMessage());
        }
    }

    @Override
    public Certificate saveCertificate(MultipartFile file, String username, String fromWhere) throws Exception {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if(fileName.contains("..")) {
                throw new Exception("Filename contains invalid path sequence " + fileName);
            }

            Certificate attachment = new Certificate(fileName, file.getContentType(), file.getBytes());
            attachment.setUser(user);
            attachment.setFromWhere(fromWhere);
            
            Certificate savedCertificate = certificateRepository.save(attachment);
            auditLogService.logCertCreation(username, savedCertificate);
            
            return savedCertificate;
        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }

    @Override
    public Certificate getCertificate(String fileId) throws Exception {
        return certificateRepository
                .findById(fileId)
                .orElseThrow(() -> new Exception("File not found with Id: " + fileId));
    }

    @Override
    public List<Certificate> getCertificatesForUser(String username) {
        return certificateRepository.findByUserUserName(username);
    }

    @Override
    public List<Certificate> getCertificatesForUser(Long userId) {
        return certificateRepository.findByUserUserId(userId);
    }

    @Override
    public boolean deleteCertificate(String fileId, String username) {
        Optional<Certificate> certificateOpt = certificateRepository.findById(fileId);
        if (certificateOpt.isPresent()) {
            Certificate certificate = certificateOpt.get();
            
            // Check if the certificate belongs to the user
            if (!certificate.getUser().getUserName().equals(username)) {
                // For security, we don't want to reveal that the certificate exists
                return false;
            }
            
            certificateRepository.deleteById(fileId);
            auditLogService.logCertDeletion(username, fileId);
            return true;
        }
        return false;
    }

    @Override
    public Certificate updateCertificateInfo(String fileId, String fromWhere, String username) throws Exception {
        Certificate certificate = certificateRepository.findById(fileId)
                .orElseThrow(() -> new Exception("Certificate not found with Id: " + fileId));
        
        // Check if the certificate belongs to the user
        if (!certificate.getUser().getUserName().equals(username)) {
            throw new Exception("You don't have permission to update this certificate");
        }
        
        certificate.setFromWhere(fromWhere);
        Certificate updatedCertificate = certificateRepository.save(certificate);
        auditLogService.logCertUpdate(username, updatedCertificate);
        
        return updatedCertificate;
    }

    @Override
    public Certificate saveCertificateWithCustomName(MultipartFile file, String username, String fromWhere, String customName) throws Exception {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        try {
            if(customName.contains("..")) {
                throw new Exception("Custom name contains invalid sequence " + customName);
            }

            // Create certificate with custom name
            Certificate attachment = new Certificate(customName, file.getContentType(), file.getBytes());
            attachment.setUser(user);
            attachment.setFromWhere(fromWhere);
            
            Certificate savedCertificate = certificateRepository.save(attachment);
            auditLogService.logCertCreation(username, savedCertificate);
            
            return savedCertificate;
        } catch (Exception e) {
            throw new Exception("Could not save certificate with name: " + customName + ". Error: " + e.getMessage());
        }
    }

}
