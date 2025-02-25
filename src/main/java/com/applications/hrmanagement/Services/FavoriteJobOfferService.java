package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.Repositories.FavoriteJobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriteJobOfferService  implements IFavoriteJobOfferService
{

    @Autowired
    private FavoriteJobOfferRepository favoriteJobOfferRepository;

    public FavoriteJobOffer addToFavorites(String userId, String jobOfferId) {
        if (!favoriteJobOfferRepository.existsByUserIdAndJobOfferId(userId, jobOfferId)) {
            FavoriteJobOffer favorite = new FavoriteJobOffer(userId, jobOfferId);
            return favoriteJobOfferRepository.save(favorite);
        }
        return null; // Déjà en favoris
    }

    public List<FavoriteJobOffer> getFavoritesByUser(String userId) {
        return favoriteJobOfferRepository.findByUserId(userId);
    }

    public void removeFromFavorites(String userId, String jobOfferId) {
        favoriteJobOfferRepository.deleteByUserIdAndJobOfferId(userId, jobOfferId);
    }
}
