package com.applications.hrmanagement.Services;

import com.applications.hrmanagement.Entities.FavoriteJobOffer;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Repositories.FavoriteJobOfferRepository;
import com.applications.hrmanagement.Repositories.JobOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.applications.hrmanagement.DTO.FavorisDTO;
import java.util.List;
import java.util.Optional;
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

        // Vérifier si l'offre d'emploi existe
        Optional<jobOffer> jobOfferOpt = jobOfferRepository.findById(jobOfferId);
        if (jobOfferOpt.isEmpty()) {
            throw new RuntimeException("L'offre d'emploi avec l'ID " + jobOfferId + " n'existe pas");
        }

        // Vérifier si l'offre est déjà dans les favoris
        if (favoriteJobOfferRepository.existsByUserIdAndJobOfferId(effectiveUserId, jobOfferId)) {
            throw new RuntimeException("Cette offre est déjà dans vos favoris");
        }

        // Créer une nouvelle entrée dans les favoris
        FavoriteJobOffer favoriteJobOffer = new FavoriteJobOffer();
        favoriteJobOffer.setUserId(effectiveUserId);
        favoriteJobOffer.setJobOfferId(jobOfferId);
        
        // Ajouter les détails de l'offre
        jobOffer offer = jobOfferOpt.get();
        favoriteJobOffer.setTitle(offer.getTitle());
        favoriteJobOffer.setLocation(String.valueOf(offer.getLocation()));
        favoriteJobOffer.setCreatedat(offer.getCreatedAt());

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
                    FavorisDTO response = new FavorisDTO();
                    response.setId(favorite.getId());
                    response.setUserId(favorite.getUserId());
                    response.setJobOfferId(favorite.getJobOfferId());
                    
                    // Essayer de récupérer les détails du job s'ils existent encore
                    Optional<jobOffer> jobOfferOpt = jobOfferRepository.findById(favorite.getJobOfferId());
                    if (jobOfferOpt.isPresent()) {
                        jobOffer jobOffer = jobOfferOpt.get();
                        response.setTitle(jobOffer.getTitle());
                        response.setLocation(String.valueOf(jobOffer.getLocation()));
                        response.setCreatedat(jobOffer.getCreatedAt());
                    } else {
                        // Si l'offre n'existe plus, utiliser les données sauvegardées dans le favori
                        response.setTitle(favorite.getTitle());
                        response.setLocation(favorite.getLocation());
                        response.setCreatedat(favorite.getCreatedat());
                    }

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
            throw new RuntimeException("Cette offre n'est pas dans vos favoris");
        }

        try {
            favoriteJobOfferRepository.deleteByUserIdAndJobOfferId(effectiveUserId, jobOfferId);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression du favori: " + e.getMessage());
        }
    }
}