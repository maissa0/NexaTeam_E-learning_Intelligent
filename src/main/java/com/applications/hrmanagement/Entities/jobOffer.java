package com.applications.hrmanagement.Entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "job_offer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class jobOffer {
    @Id
    private String id;

    private String title;
    private String description;
    private ContractType contractType;
    private JobLocation location; // Enum
    private ExperienceLevel experienceLevel;
    private List<String> requiredSkills;
   // private List<String> benefits;

    private String enterpriseId;


    private Date createdAt;
    private JobOfferStatus status;
}
