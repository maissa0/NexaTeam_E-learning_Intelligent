package com.esprit.userAuth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String qualification;
    private String year;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
} 