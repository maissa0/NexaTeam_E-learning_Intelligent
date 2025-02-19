package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.JobApplicationStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


@Getter
@Setter

public class JobApplicationDTO {

    private String idjobApp;
    private String name;
    private String email;
    private String telephone;
    private String resumeUrl;
    private String coverLetterUrl;
    private JobApplicationStatus status;
    private LocalDate submissionDate;
}
