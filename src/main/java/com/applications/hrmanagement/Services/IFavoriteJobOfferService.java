package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.DTO.FavorisDTO;
import com.applications.hrmanagement.Entities.jobOffer;

import java.util.List;

    interface IFavoriteJobOfferService {
        public FavoriteJobOffer addJobOfferToFavorites(String userId, String jobOfferId);
        public List<FavorisDTO> getFavoritesByUser(String userId);
    void removeFromFavorites(String userId, String jobOfferId);
}