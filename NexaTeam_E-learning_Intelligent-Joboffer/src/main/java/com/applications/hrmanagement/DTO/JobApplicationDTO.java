package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.JobApplicationStatus;
import com.applications.hrmanagement.Entities.ContractType;
import com.applications.hrmanagement.Entities.JobLocation;
import com.applications.hrmanagement.Entities.ExperienceLevel;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class JobApplicationDTO {
    private String idjobApp;
    private userDTO user;
    private String name;
    private String email;
    private String telephone;
    private String resumeUrl;
    private String coverLetterUrl;
    private JobApplicationStatus status;
    private LocalDate submissionDate;
    
    // Informations détaillées de l'offre d'emploi
    private String jobOfferId;
    private String jobOfferTitle;
    private String jobDescription;
    private ContractType jobContractType;
    private JobLocation jobLocation;
    private ExperienceLevel jobExperienceLevel;
    private String jobRequiredSkills;
    private String jobEnterpriseId;
    private LocalDate jobCreatedAt;
}