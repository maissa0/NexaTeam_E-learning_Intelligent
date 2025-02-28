package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

public interface IjobOfferService {

    List<jobOffer> getAllJobOffers();

    jobOffer getJobOfferById(String id);

    jobOffer createJobOffer(JobOfferDto jobOfferDTO);

    public jobOffer incrementViewCount(String id);
    jobOffer updateJobOffer(String id, JobOfferDto jobOfferDTO);

    void deleteJobOffer(String id);
    public List<jobOffer> searchJobOffers(JobOfferDto searchDTO);
}
