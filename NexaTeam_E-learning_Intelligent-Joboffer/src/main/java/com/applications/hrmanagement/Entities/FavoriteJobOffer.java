package com.applications.hrmanagement.Entities;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;


@Document(collection = "favoriteJobOffers")

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteJobOffer {

    @Id
    private String id;
    private String userId;   // ID de l'utilisateur
    private String jobOfferId;  // ID de l'offre d'emploi
    private LocalDate createdat;
    private String Location;   // ID de l'utilisateur
    private String Title;

}
