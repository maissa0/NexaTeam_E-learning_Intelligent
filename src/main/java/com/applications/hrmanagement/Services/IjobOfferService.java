package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

public interface IjobOfferService {

    List<jobOffer> getAllJobOffers();

    jobOffer getJobOfferById(String id);

    jobOffer createJobOffer(JobOfferDto jobOfferDTO);

    jobOffer updateJobOffer(String id, JobOfferDto jobOfferDTO);

    void deleteJobOffer(String id);
}
