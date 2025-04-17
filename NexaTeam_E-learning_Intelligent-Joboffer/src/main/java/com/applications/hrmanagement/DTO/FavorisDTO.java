package com.applications.hrmanagement.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FavorisDTO {
    private String id;
    private String userId;   // ID de l'utilisateur
    private String jobOfferId;  // ID de l'offre d'emploi
    private LocalDate createdat;
    private String Location;   // ID de l'utilisateur
    private String Title;

}
