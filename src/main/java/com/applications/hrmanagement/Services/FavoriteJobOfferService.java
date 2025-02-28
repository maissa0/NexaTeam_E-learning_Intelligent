package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Repositories.FavoriteJobOfferRepository;
import com.applications.hrmanagement.Repositories.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.DTO.FavorisDTO;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteJobOfferService implements IFavoriteJobOfferService {

    @Autowired
    private FavoriteJobOfferRepository favoriteJobOfferRepository;

    @Autowired
    private JobOfferRepository jobOfferRepository;

    private static final String DEFAULT_USER_ID = "65f1c2e8a1b2c3d4e5f6a7b8"; // ID utilisateur par défaut

    // Ajouter une offre d'emploi aux favoris
    @Override
    public FavoriteJobOffer addJobOfferToFavorites(String userId, String jobOfferId) {
        // Utiliser l'ID utilisateur par défaut si aucun userId n'est fourni
        String effectiveUserId = (userId != null && !userId.isEmpty()) ? userId : DEFAULT_USER_ID;

        // Récupérer l'offre d'emploi depuis la base de données
        jobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new RuntimeException("JobOffer not found"));

        // Vérifier si l'offre est déjà dans les favoris
        if (favoriteJobOfferRepository.existsByUserIdAndJobOfferId(effectiveUserId, jobOfferId)) {
            throw new RuntimeException("JobOffer already in favorites");
        }

        // Créer une nouvelle entrée dans les favoris
        FavoriteJobOffer favoriteJobOffer = new FavoriteJobOffer();
        favoriteJobOffer.setUserId(effectiveUserId);
        favoriteJobOffer.setJobOfferId(jobOfferId);

        return favoriteJobOfferRepository.save(favoriteJobOffer);
    }

    // Récupérer les favoris d'un utilisateur avec les détails du job
    @Override
    public List<FavorisDTO> getFavoritesByUser(String userId) {
        // Utiliser l'ID utilisateur par défaut si aucun userId n'est fourni
        String effectiveUserId = (userId != null && !userId.isEmpty()) ? userId : DEFAULT_USER_ID;

        // Récupérer les favoris de l'utilisateur
        List<FavoriteJobOffer> favorites = favoriteJobOfferRepository.findByUserId(effectiveUserId);

        // Construire la réponse avec les détails du job
        return favorites.stream()
                .map(favorite -> {
                    // Récupérer les détails du job depuis la base de données
                    jobOffer jobOffer = jobOfferRepository.findById(favorite.getJobOfferId())
                            .orElseThrow(() -> new RuntimeException("JobOffer not found"));

                    // Créer la réponse
                    FavorisDTO response = new FavorisDTO();
                    response.setId(favorite.getId());
                    response.setUserId(favorite.getUserId());
                    response.setJobOfferId(favorite.getJobOfferId());
                    response.setTitle(jobOffer.getTitle());
                    response.setLocation(String.valueOf(jobOffer.getLocation()));
                    response.setCreatedat(jobOffer.getCreatedAt());

                    return response;
                })
                .collect(Collectors.toList());
    }

    // Supprimer une offre d'emploi des favoris
    @Override
    public void removeFromFavorites(String userId, String jobOfferId) {
        // Utiliser l'ID utilisateur par défaut si aucun userId n'est fourni
        String effectiveUserId = (userId != null && !userId.isEmpty()) ? userId : DEFAULT_USER_ID;

        // Vérifier si l'entrée existe avant de la supprimer
        if (!favoriteJobOfferRepository.existsByUserIdAndJobOfferId(effectiveUserId, jobOfferId)) {
            throw new RuntimeException("Favorite not found");
        }
        favoriteJobOfferRepository.deleteByUserIdAndJobOfferId(effectiveUserId, jobOfferId);
    }
}