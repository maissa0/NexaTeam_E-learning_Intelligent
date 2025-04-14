package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Certificate;

import com.esprit.userAuth.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CertificateService {

    /*Certificate createCertificateForUser(String username, String title, MultipartFile file);

    Certificate updateCertificateForUser(Long cerId, String title, String username);

    void deleteCertificateForUser(Long cerId, String username);

    List<Certificate> getCertificatesForUser(String username);*/

    /**
     * Save a certificate for a user
     * @param file The file to save
     * @param username The username of the user
     * @param fromWhere Where the certificate is from
     * @return The saved certificate
     * @throws Exception If an error occurs
     */
    Certificate saveCertificate(MultipartFile file, String username, String fromWhere) throws Exception;

    /**
     * Get a certificate by its ID
     * @param fileId The ID of the certificate
     * @return The certificate
     * @throws Exception If the certificate is not found
     */
    Certificate getCertificate(String fileId) throws Exception;
    
    /**
     * Get all certificates for a user
     * @param username The username of the user
     * @return The list of certificates
     */
    List<Certificate> getCertificatesForUser(String username);
    
    /**
     * Get all certificates for a user by user ID
     * @param userId The ID of the user
     * @return The list of certificates
     */
    List<Certificate> getCertificatesForUser(Long userId);
    
    /**
     * Delete a certificate
     * @param fileId The ID of the certificate
     * @param username The username of the user (for audit logging)
     * @return true if the certificate was deleted, false otherwise
     */
    boolean deleteCertificate(String fileId, String username);
    
    /**
     * Update certificate information
     * @param fileId The ID of the certificate
     * @param fromWhere The new "from where" value
     * @param username The username of the user (for audit logging)
     * @return The updated certificate
     * @throws Exception If the certificate is not found
     */
    Certificate updateCertificateInfo(String fileId, String fromWhere, String username) throws Exception;


    Certificate storeCertificate(MultipartFile file, String title, String fromWhere, User user) throws IOException;

    /**
     * Save a certificate for a user with a custom name
     * @param file The file to save
     * @param username The username of the user
     * @param fromWhere Where the certificate is from
     * @param customName The custom name for the certificate
     * @return The saved certificate
     * @throws Exception If an error occurs
     */
    Certificate saveCertificateWithCustomName(MultipartFile file, String username, String fromWhere, String customName) throws Exception;
}
