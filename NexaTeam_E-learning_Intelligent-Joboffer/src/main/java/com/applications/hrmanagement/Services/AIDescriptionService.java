package com.applications.hrmanagement.Services;

import org.springframework.stereotype.Service;
import com.applications.hrmanagement.DTO.JobOfferDto;

@Service
public class AIDescriptionService {
    
    public String generateDescription(JobOfferDto jobOfferDto) {
        StringBuilder description = new StringBuilder();
        
        // Début de la description avec le titre
        description.append("Nous recherchons un(e) ").append(jobOfferDto.getTitle()).append(" ");
        
        // Ajouter le type de contrat
        description.append("pour un poste en ").append(jobOfferDto.getContractType()).append(". ");
        
        // Ajouter la localisation
        description.append("Le poste est basé à ").append(jobOfferDto.getLocation()).append(". ");
        
        // Ajouter le niveau d'expérience
        description.append("Nous recherchons un candidat avec un niveau d'expérience ").append(jobOfferDto.getExperienceLevel()).append(". ");
        
        // Ajouter les compétences requises
        if (jobOfferDto.getRequiredSkills() != null && !jobOfferDto.getRequiredSkills().isEmpty()) {
            description.append("Les compétences requises pour ce poste sont : ");
            description.append(String.join(", ", jobOfferDto.getRequiredSkills())).append(". ");
        }
        
        return description.toString();
    }
} 