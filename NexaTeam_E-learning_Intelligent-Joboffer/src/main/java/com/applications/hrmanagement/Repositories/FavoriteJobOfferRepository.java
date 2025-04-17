package com.applications.hrmanagement.Repositories;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FavoriteJobOfferRepository extends MongoRepository<FavoriteJobOffer, String> {
    List<FavoriteJobOffer> findByUserId(String userId);
    void deleteByUserIdAndJobOfferId(String userId, String jobOfferId);
    boolean existsByUserIdAndJobOfferId(String userId, String jobOfferId);
}

