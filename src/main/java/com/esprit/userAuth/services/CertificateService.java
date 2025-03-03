package com.esprit.userAuth.services;

import com.esprit.userAuth.entities.Certificate;

import java.util.List;

public interface CertificateService {

    Certificate createCertificateForUser(String username, String title);

    Certificate updateCertificateForUser(Long cerId, String title, String username);

    void deleteCertificateForUser(Long cerId, String username);

    List<Certificate> getCertificatesForUser(String username);
}
