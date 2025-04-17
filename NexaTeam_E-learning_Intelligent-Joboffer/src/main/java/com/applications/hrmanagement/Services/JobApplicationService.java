package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.DTO.JobApplicationDTO;
import com.applications.hrmanagement.Entities.JobApplication;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Repositories.JobApplicationRepository;
import com.applications.hrmanagement.Repositories.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.applications.hrmanagement.Entities.User;
import com.applications.hrmanagement.Entities.JobApplicationStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class JobApplicationService implements IJobApplicationService {
    @Autowired
    private IEmailService emailService;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Override
    public JobApplicationDTO createJobApplication(JobApplicationDTO jobApplicationDTO) {
        // Créer un objet User avec l'ID par défaut
        User defaultUser = new User();
        defaultUser.setUserId("65f1c2e8a1b2c3d4e5f6a7b8");
        
        JobApplication jobApplication = convertToEntity(jobApplicationDTO);
        jobApplication.setUser(defaultUser); // Associer l'utilisateur par défaut

        // Récupérer et associer le JobOffer
        if (jobApplicationDTO.getJobOfferId() != null) {
            jobOffer offer = jobOfferRepository.findById(jobApplicationDTO.getJobOfferId())
                .orElseThrow(() -> new RuntimeException("JobOffer not found with id: " + jobApplicationDTO.getJobOfferId()));
            jobApplication.setJobOffer(offer);
        }

        jobApplication = jobApplicationRepository.save(jobApplication);

        // Vérifier que l'email est valide avant d'envoyer
        if (jobApplication.getEmail() != null && !jobApplication.getEmail().isEmpty()) {
            String to = jobApplication.getEmail();
            String subject = "Confirmation de candidature";
            String name = jobApplication.getName();

            try {
                emailService.sendEmail(to, subject, name);
            } catch (IllegalArgumentException e) {
                // Log l'erreur mais ne pas arrêter le processus
                System.err.println("Erreur d'envoi d'email: " + e.getMessage());
            }
        }

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
        jobApplication.setStatus(jobApplicationDTO.getStatus() != null ? jobApplicationDTO.getStatus() : JobApplicationStatus.PENDING);
        jobApplication.setSubmissionDate(jobApplicationDTO.getSubmissionDate() != null ? jobApplicationDTO.getSubmissionDate() : LocalDate.now());
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
        
        // Ajouter l'ID de l'offre d'emploi et son titre si elle existe
        if (jobApplication.getJobOffer() != null) {
            jobOffer offer = jobApplication.getJobOffer();
            dto.setJobOfferId(offer.getId());
            dto.setJobOfferTitle(offer.getTitle());
        }
        
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

    @Override
    public List<JobApplicationDTO> getJobApplicationsByUserId(String userId) {
        // Pour l'instant, on utilise un userId par défaut
        String effectiveUserId = (userId != null && !userId.isEmpty()) ? userId : "65f1c2e8a1b2c3d4e5f6a7b8";
        
        // Créer un objet User avec l'ID
        User user = new User();
        user.setUserId(effectiveUserId);
        
        // Récupérer les candidatures par userId
        List<JobApplication> jobApplications = jobApplicationRepository.findByUser(user);
        
        // Convertir en DTOs
        return jobApplications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}