package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.DTO.offersDTO;
import com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

public interface IofferService {
    List<offersDTO> getAllJobOffers();

    jobOffer getJobOfferById(String id);
}
