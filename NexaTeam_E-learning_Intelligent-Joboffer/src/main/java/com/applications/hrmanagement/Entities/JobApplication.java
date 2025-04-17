package com.applications.hrmanagement.Entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;

@Document(collection = "JobApplication")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class JobApplication {
    @Id
    private String idjobApp;
    
    @DBRef
    private User user; // Référence à l'utilisateur qui a postulé
    
    private String name;
    private String email;
    private String telephone;
    private String resumeUrl;
    private String coverLetterUrl;
    private JobApplicationStatus status;  // État de la candidature ("En attente", "Accepté", "Refusé", "Entretien prévu")
    private LocalDate submissionDate;  // Date de soumission de la candidature

    @DBRef
    private jobOffer JobOffer; // Référence à l'offre d'emploi
}