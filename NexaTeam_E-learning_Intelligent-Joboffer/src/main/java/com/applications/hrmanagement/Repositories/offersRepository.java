package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.Entities.jobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface offersRepository  extends MongoRepository<jobOffer,String> {
}