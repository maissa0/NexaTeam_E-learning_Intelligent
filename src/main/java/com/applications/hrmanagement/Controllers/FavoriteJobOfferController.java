package com.applications.hrmanagement.Controllers;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.Services.FavoriteJobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/favorites")
public class FavoriteJobOfferController {

    @Autowired
    private FavoriteJobOfferService favoriteJobOfferService;

    @PostMapping("add/{userId}/{jobOfferId}")
    public FavoriteJobOffer addToFavorites(@PathVariable String userId, @PathVariable String jobOfferId) {
        return favoriteJobOfferService.addToFavorites(userId, jobOfferId);
    }

    @GetMapping("affichage/{userId}")
    public List<FavoriteJobOffer> getFavoritesByUser(@PathVariable String userId) {
        return favoriteJobOfferService.getFavoritesByUser(userId);
    }

    @DeleteMapping("remove/{userId}/{jobOfferId}")
    public void removeFromFavorites(@PathVariable String userId, @PathVariable String jobOfferId) {
        favoriteJobOfferService.removeFromFavorites(userId, jobOfferId);
    }
}

