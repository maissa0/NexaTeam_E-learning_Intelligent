package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Entities.jobOffer;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface JobOfferRepositoryCustom {
    List<jobOffer> searchJobOffers(JobOfferDto searchDTO);
}
