package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.ContractType;
import com.applications.hrmanagement.Entities.ExperienceLevel;
import com.applications.hrmanagement.Entities.JobLocation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobOfferDto {
    private String title;
    private String description;
    private ContractType contractType; // Enum
    private JobLocation location; // Enum
    private ExperienceLevel experienceLevel; // Enum
    private String requiredSkills;

    //private String enterpriseId;

    private LocalDate createdAt;
    // Paramètres de filtre
    private int page = 0; // Page par défaut
    private int size = 10; // Taille par défaut
    private String sortBy = "createdAt"; // Champ de tri par défaut
    private String sortDirection = "asc"; // Direction de tri par défaut
}
