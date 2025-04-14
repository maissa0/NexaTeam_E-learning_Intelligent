package com.esprit.userAuth.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
@Table(name = "certificate")
public class Certificate {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String title;

    private String fromWhere;

    private String fileType;

    @Lob
    private byte[] data;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Default constructor required by JPA
    public Certificate() {
    }

    public Certificate (String title, String fileType, byte[] data) {
        this.title = title;
        this.fileType = fileType;
        this.data = data;
    }
}

