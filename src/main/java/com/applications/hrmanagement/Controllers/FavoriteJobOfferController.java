package com.applications.hrmanagement.Controllers;
import  com.applications.hrmanagement.DTO.FavorisDTO;
import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.Services.FavoriteJobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController

@RequestMapping("/api/favorites")
public class FavoriteJobOfferController {

    @Autowired
    private FavoriteJobOfferService favoriteJobOfferService;

    // Ajouter une offre d'emploi aux favoris
    @PostMapping("/add")
    public ResponseEntity<FavoriteJobOffer> addToFavorites(
            @RequestParam(required = false) String userId,
            @RequestParam String jobOfferId) {
        FavoriteJobOffer favoriteJobOffer = favoriteJobOfferService.addJobOfferToFavorites(userId, jobOfferId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favoriteJobOffer);
    }

    // Récupérer les favoris d'un utilisateur avec les détails du job
    @GetMapping("/user")
    public ResponseEntity<List<FavorisDTO>> getFavoritesByUser(
            @RequestParam(required = false) String userId) {
        List<FavorisDTO> favorites = favoriteJobOfferService.getFavoritesByUser(userId);
        return ResponseEntity.ok(favorites);
    }

    // Supprimer une offre d'emploi des favoris
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromFavorites(
            @RequestParam(required = false) String userId,
            @RequestParam String jobOfferId) {
        favoriteJobOfferService.removeFromFavorites(userId, jobOfferId);
        return ResponseEntity.noContent().build();
    }
}
