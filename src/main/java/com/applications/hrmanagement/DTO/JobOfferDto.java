package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.ContractType;
import com.applications.hrmanagement.Entities.ExperienceLevel;
import com.applications.hrmanagement.Entities.JobLocation;
import com.applications.hrmanagement.Entities.JobOfferStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class JobOfferDto {
    private String title;
    private String description;
    private ContractType contractType; // Enum
    private JobLocation location; // Enum
    private ExperienceLevel experienceLevel; // Enum
    private List<String> requiredSkills;
    private List<String> benefits;

    private String enterpriseId;

    private JobOfferStatus status;
}
