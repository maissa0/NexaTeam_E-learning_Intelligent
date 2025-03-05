package com.applications.hrmanagement.Services;

import org.springframework.beans.factory.annotation.Autowired;
import com.applications.hrmanagement.DTO.JobApplicationDTO;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.Repositories.JobApplicationRepository;
import com.applications.hrmanagement.Entities.JobApplication;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Importez Collectors pour toList()

@Service
public class JobApplicationService implements IJobApplicationService {
    @Autowired
    private IEmailService emailService;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Override
    public JobApplicationDTO createJobApplication(JobApplicationDTO jobApplicationDTO) {
        JobApplication jobApplication = convertToEntity(jobApplicationDTO);
        jobApplication = jobApplicationRepository.save(jobApplication);

        String to = jobApplication.getEmail();
        String subject = "Confirmation de candidature";
        String name = jobApplication.getName();

        emailService.sendEmail(to, subject, name);

        return convertToDTO(jobApplication);
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
        return dto;
    }

    public JobApplicationDTO getJobApplicationById(String id) {
        Optional<JobApplication> jobApplication = jobApplicationRepository.findById(id);
        return jobApplication.map(this::convertToDTO).orElse(null);
    }

    public List<JobApplicationDTO> getAllJobApplications() {
        List<JobApplication> jobApplications = jobApplicationRepository.findAll();
        return jobApplications.stream().map(this::convertToDTO).toList();
    }


    public JobApplicationDTO updateJobApplication(String id, JobApplicationDTO updatedJobApplicationDTO) {
        if (jobApplicationRepository.existsById(id)) {
            JobApplication updatedJobApplication = convertToEntity(updatedJobApplicationDTO);
            updatedJobApplication.setIdjobApp(id);
            updatedJobApplication = jobApplicationRepository.save(updatedJobApplication);
            return convertToDTO(updatedJobApplication);
        }
        return null;
    }

    public void deleteJobApplication(String id) {
        jobApplicationRepository.deleteById(id);
    }
}