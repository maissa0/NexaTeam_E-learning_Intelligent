package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Repositories.offersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.DTO.offersDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService implements IofferService{
    @Autowired
    private offersRepository offersRepository;



    public List<offersDTO> getAllJobOffers() {
        List<jobOffer> jobOffers = offersRepository.findAll();
        return jobOffers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public jobOffer getJobOfferById(String id) {
        return offersRepository.findById(id).orElse(null);
    }


    private offersDTO convertToDTO(jobOffer jobOffer) {
        offersDTO dto = new offersDTO();
        dto.setTitle(jobOffer.getTitle());
        dto.setContractType(jobOffer.getContractType());
        dto.setCreatedAt(jobOffer.getCreatedAt());
        return dto;
    }

}
