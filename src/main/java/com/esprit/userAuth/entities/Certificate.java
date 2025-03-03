package com.esprit.userAuth.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "certificate")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String ownerUsername;
}
