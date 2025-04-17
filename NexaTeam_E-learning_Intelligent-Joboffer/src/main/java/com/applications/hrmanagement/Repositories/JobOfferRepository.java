package com.applications.hrmanagement.Repositories;
import com.applications.hrmanagement.Entities.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface JobOfferRepository extends MongoRepository<jobOffer, String>, JobOfferRepositoryCustom {
    // Autres méthodes de repository...
}