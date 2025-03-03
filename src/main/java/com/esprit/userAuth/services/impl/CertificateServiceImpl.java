package com.esprit.userAuth.services.impl;

import com.esprit.userAuth.entities.Certificate;
import com.esprit.userAuth.repositories.CerticateRepository;
import com.esprit.userAuth.services.AuditLogService;
import com.esprit.userAuth.services.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateServiceImpl implements CertificateService {

   @Autowired
    private CerticateRepository certicateRepository;

   @Autowired
    private AuditLogService auditLogService;

    @Override
    public Certificate createCertificateForUser(String username, String title) {
        Certificate certificate = new Certificate();
        certificate.setTitle(title);
        certificate.setOwnerUsername(username);
        auditLogService.logCertCreation(username, certificate);
        return certicateRepository.save(certificate);
    }

    @Override
    public Certificate updateCertificateForUser(Long cerId, String title, String username) {
        Certificate certificate = certicateRepository.findById(cerId).orElseThrow(()
                -> new RuntimeException("Certificate not found"));
        certificate.setTitle(title);
        auditLogService.logCertUpdate(username, certificate);
        return certicateRepository.save(certificate);
    }

    @Override
    public void deleteCertificateForUser(Long cerId, String username) {

        Certificate cert = certicateRepository.findById(cerId).orElseThrow(
                () -> new RuntimeException("certfication not found")
        );
        auditLogService.logCertDeletion(username, cerId);
        certicateRepository.deleteById(cerId);
    }

    @Override
    public List<Certificate> getCertificatesForUser(String username) {
        return certicateRepository
                .findByOwnerUsername(username);
    }
}
