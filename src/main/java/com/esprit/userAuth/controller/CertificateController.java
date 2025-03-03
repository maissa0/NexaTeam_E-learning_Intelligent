package com.esprit.userAuth.controller;

import com.esprit.userAuth.entities.Certificate;
import com.esprit.userAuth.services.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certs")
public class CertificateController {
    @Autowired
    private CertificateService certService;

    @PostMapping
    public Certificate createCertificate(@RequestBody String title,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("USER DETAILS: " + username);
        return certService.createCertificateForUser(username, title);
    }

    @GetMapping
    public List<Certificate> getUserCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("USER DETAILS: " + username);
        return certService.getCertificatesForUser(username);
    }

    @PutMapping("/{cerId}")
    public Certificate updateCertificate(@PathVariable Long cerId,
                                  @RequestBody String title,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return certService.updateCertificateForUser(cerId, title, username);
    }

    @DeleteMapping("/{cerId}")
    public void deleteCertificate(@PathVariable Long cerId,
                           @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        certService.deleteCertificateForUser(cerId, username);
    }
}
