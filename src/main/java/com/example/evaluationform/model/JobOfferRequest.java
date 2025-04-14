package com.example.evaluationform.model;

import lombok.Data;

import java.util.List;


    @Data
    public class JobOfferRequest {
        private String title;
        private String description;
        private List<String> requiredSkills;
    }


