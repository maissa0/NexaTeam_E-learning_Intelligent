package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.Entities.jobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface offersRepository   extends MongoRepository<jobOffer,String> {
}
