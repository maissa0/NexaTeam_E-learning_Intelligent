package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import java.util.List;

    interface IFavoriteJobOfferService {
    FavoriteJobOffer addToFavorites(String userId, String jobOfferId);
    List<FavoriteJobOffer> getFavoritesByUser(String userId);
    void removeFromFavorites(String userId, String jobOfferId);
}