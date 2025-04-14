package com.esprit.userAuth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String address;
    private String startDate;
    private String endDate;
    private String summary;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
} 