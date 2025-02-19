package com.applications.hrmanagement.Repositories;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Entities.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobOfferRepository extends MongoRepository<jobOffer,String> {
}
