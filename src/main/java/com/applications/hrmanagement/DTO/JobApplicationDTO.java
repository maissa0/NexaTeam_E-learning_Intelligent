package com.applications.hrmanagement.DTO;

import com.applications.hrmanagement.Entities.JobApplication;
import com.applications.hrmanagement.Entities.JobApplicationStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
    private String jobOfferTitle;
    private JobApplicationDTO convertToDTO(JobApplication jobApplication) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setIdjobApp(jobApplication.getIdjobApp());
        dto.setName(jobApplication.getName());
        dto.setEmail(jobApplication.getEmail());
        dto.setTelephone(jobApplication.getTelephone());
        dto.setResumeUrl(jobApplication.getResumeUrl());
        dto.setCoverLetterUrl(jobApplication.getCoverLetterUrl());
        dto.setStatus(jobApplication.getStatus());
        dto.setSubmissionDate(jobApplication.getSubmissionDate());
        dto.setJobOfferTitle(jobApplication.getJobOfferTitle());
        return dto;
    }
    private JobApplication convertToEntity(JobApplicationDTO jobApplicationDTO) {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setIdjobApp(jobApplicationDTO.getIdjobApp());
        jobApplication.setName(jobApplicationDTO.getName());
        jobApplication.setEmail(jobApplicationDTO.getEmail());
        jobApplication.setTelephone(jobApplicationDTO.getTelephone());
        jobApplication.setResumeUrl(jobApplicationDTO.getResumeUrl());
        jobApplication.setCoverLetterUrl(jobApplicationDTO.getCoverLetterUrl());
        jobApplication.setStatus(jobApplicationDTO.getStatus());
        jobApplication.setSubmissionDate(jobApplicationDTO.getSubmissionDate());
        return jobApplication;
    }

}
