package com.applications.hrmanagement.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.Repositories.JobApplicationRepository;
import com.applications.hrmanagement.Entities.JobApplication;
import com.applications.hrmanagement.DTO.JobApplicationDTO;
import com.applications.hrmanagement.Services.IJobApplicationService;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService implements  IJobApplicationService{

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public JobApplicationDTO createJobApplication(JobApplicationDTO jobApplicationDTO) {
        JobApplication jobApplication = convertToEntity(jobApplicationDTO);
        jobApplication = jobApplicationRepository.save(jobApplication);
        return convertToDTO(jobApplication);
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
        JobApplicationDTO jobApplicationDTO = new JobApplicationDTO();
        jobApplicationDTO.setIdjobApp(jobApplication.getIdjobApp());
        jobApplicationDTO.setName(jobApplication.getName());
        jobApplicationDTO.setEmail(jobApplication.getEmail());
        jobApplicationDTO.setTelephone(jobApplication.getTelephone());
        jobApplicationDTO.setResumeUrl(jobApplication.getResumeUrl());
        jobApplicationDTO.setCoverLetterUrl(jobApplication.getCoverLetterUrl());
        jobApplicationDTO.setStatus(jobApplication.getStatus());
        jobApplicationDTO.setSubmissionDate(jobApplication.getSubmissionDate());
        return jobApplicationDTO;
    }
}
