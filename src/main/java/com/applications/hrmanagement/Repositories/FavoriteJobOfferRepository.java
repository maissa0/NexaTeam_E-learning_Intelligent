package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FavoriteJobOfferRepository extends MongoRepository<FavoriteJobOffer, String> {
    List<FavoriteJobOffer> findByUserId(String userId);
    void deleteByUserIdAndJobOfferId(String userId, String jobOfferId);
    boolean existsByUserIdAndJobOfferId(String userId, String jobOfferId);
}

