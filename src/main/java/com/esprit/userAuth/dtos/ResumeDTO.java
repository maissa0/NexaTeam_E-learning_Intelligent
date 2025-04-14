package com.esprit.userAuth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for Resume and all its related components
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDTO {
    private Long id;
    private Long userId;
    private String title;
    private String name;
    private String job;
    private String address;
    private String phone;
    private String email;
    private String themeColor;
    private String summary;
    
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
    private List<SkillDTO> skills;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceDTO {
        private Long id;
        private String title;
        private String company;
        private String address;
        private String startDate;
        private String endDate;
        private String summary;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDTO {
        private Long id;
        private String name;
        private String address;
        private String qualification;
        private String year;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDTO {
        private Long id;
        private String name;
        private String level;
    }
} 