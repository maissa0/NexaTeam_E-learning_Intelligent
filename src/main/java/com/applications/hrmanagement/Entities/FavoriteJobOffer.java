package com.applications.hrmanagement.Entities;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "favoriteJobOffers")

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteJobOffer {

    @Id
    private String id;
    private String userId;   // ID de l'utilisateur
    private String jobOfferId;  // ID de l'offre d'emploi

    public FavoriteJobOffer(String userId, String jobOfferId) {
    }
}
