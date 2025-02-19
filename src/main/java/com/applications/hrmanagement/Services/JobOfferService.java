package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.DTO.JobOfferDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.Repositories.JobOfferRepository;
import com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

@Service
public class JobOfferService implements IjobOfferService{




    @Autowired
    private JobOfferRepository jobOfferRepository;

    @Override
    public List<jobOffer> getAllJobOffers() {
        return jobOfferRepository.findAll();
    }

    @Override
    public jobOffer getJobOfferById(String id) {
        return jobOfferRepository.findById(id).orElse(null);
    }

    @Override
    public jobOffer createJobOffer(JobOfferDto jobOfferDTO) {
        jobOffer jobOffer = convertToEntity(jobOfferDTO);
        return jobOfferRepository.save(jobOffer);
    }

    @Override
    public jobOffer updateJobOffer(String id, JobOfferDto jobOfferDTO) {
        if (jobOfferRepository.existsById(id)) {
            jobOffer jobOffer = convertToEntity(jobOfferDTO);
            jobOffer.setId(id); // Ensure ID remains unchanged
            return jobOfferRepository.save(jobOffer);
        }
        return null;
    }

    @Override
    public void deleteJobOffer(String id) {
        jobOfferRepository.deleteById(id);
    }

    // Utility method to convert DTO to Entity
    private jobOffer convertToEntity(JobOfferDto dto) {
        jobOffer jobOffer = new jobOffer();
        jobOffer.setTitle(dto.getTitle());
        jobOffer.setDescription(dto.getDescription());
        jobOffer.setContractType(dto.getContractType());
        jobOffer.setLocation(dto.getLocation());
        jobOffer.setExperienceLevel(dto.getExperienceLevel());
        jobOffer.setRequiredSkills(dto.getRequiredSkills());
        //jobOffer.setBenefits(dto.getBenefits());
        jobOffer.setEnterpriseId(dto.getEnterpriseId());
        jobOffer.setStatus(dto.getStatus());
        return jobOffer;
    }}


