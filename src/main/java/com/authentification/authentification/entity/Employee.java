
package com.authentification.authentification.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employees")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nom;
    private String prenom;
    private String dateDeNaissance;
    private String numero;

    @OneToOne(mappedBy = "employee")
    @JsonBackReference
    private User user;
}
