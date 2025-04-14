package com.esprit.userAuth.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String title;
    private String name;
    private String job;
    private String address;
    private String phone;
    private String email;
    private String themeColor;
    private String summary;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private List<Experience> experience;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private List<Education> education;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private List<Skill> skills;
} 