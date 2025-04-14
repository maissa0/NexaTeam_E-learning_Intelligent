package com.esprit.userAuth.controller;

import com.esprit.userAuth.dtos.ResumeDTO;
import com.esprit.userAuth.entity.Education;
import com.esprit.userAuth.entity.Experience;
import com.esprit.userAuth.entity.Resume;
import com.esprit.userAuth.entity.Skill;
import com.esprit.userAuth.entity.User;
import com.esprit.userAuth.repository.UserRepository;
import com.esprit.userAuth.service.PDFService;
import com.esprit.userAuth.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final PDFService pdfService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody Resume resume) {
        return ResponseEntity.ok(resumeService.createResume(resume));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable Long id) {
        Resume resume = resumeService.getResumeWithDetails(id);
        return resume != null ? ResponseEntity.ok(resume) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resume>> getUserResumes(@PathVariable Long userId) {
        return ResponseEntity.ok(resumeService.getUserResumes(userId));
    }

    /**
     * Get all resumes for the authenticated user with their complete details
     * including experiences, education, and skills.
     * 
     * @param authentication The Spring Security authentication object for the current user
     * @return List of all resumes with their associated data for the authenticated user
     */
    @GetMapping("/my-resumes")
    public ResponseEntity<List<Resume>> getAuthenticatedUserResumes(Authentication authentication) {
        try {
            // Get the authenticated user's ID
            String username = authentication.getName();
            
            // Fetch the user by username to get their ID
            User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Long authenticatedUserId = user.getUserId();
            
            // Get all resumes for this user with complete details
            List<Resume> detailedResumes = resumeService.getUserResumesWithDetails(authenticatedUserId);
            
            return ResponseEntity.ok(detailedResumes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @RequestBody Resume resume) {
        Resume updatedResume = resumeService.updateResume(id, resume);
        return updatedResume != null ? ResponseEntity.ok(updatedResume) : ResponseEntity.notFound().build();
    }
    
    /**
     * Create a resume with all its components (experiences, skills, educations) in one API call.
     * This method:
     * 1. Creates the main resume entity with basic information
     * 2. Associates it with the authenticated user automatically
     * 3. Creates and links all related experiences, education entries, and skills
     * 4. Saves everything to the database in a single transaction
     *
     * @param resumeDTO The DTO containing all resume data
     * @return The created resume entity with all its associated components
     */
    @PostMapping("/from-dto")
    public ResponseEntity<Resume> createResumeFromDTO(@RequestBody ResumeDTO resumeDTO, Authentication authentication) {
        try {
            // Get the authenticated user's ID
            String username = authentication.getName();
            
            // Fetch the user by username to get their ID
            User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Long authenticatedUserId = user.getUserId();
            
            // 1. Create the main resume entity with basic information
            Resume resume = new Resume();
            resume.setUserId(authenticatedUserId);  // Link to authenticated user
            resume.setTitle(resumeDTO.getTitle());
            resume.setName(resumeDTO.getName());
            resume.setJob(resumeDTO.getJob());
            resume.setAddress(resumeDTO.getAddress());
            resume.setPhone(resumeDTO.getPhone());
            resume.setEmail(resumeDTO.getEmail());
            resume.setThemeColor(resumeDTO.getThemeColor());
            resume.setSummary(resumeDTO.getSummary());
            
            // Initialize empty collections for the relationships
            resume.setExperience(new ArrayList<>());
            resume.setEducation(new ArrayList<>());
            resume.setSkills(new ArrayList<>());
            
            // 2. First save the resume to get an ID (needed for relationships)
            Resume savedResume = resumeService.createResume(resume);
            
            // 3. Process experiences
            if (resumeDTO.getExperiences() != null && !resumeDTO.getExperiences().isEmpty()) {
                List<Experience> experiences = new ArrayList<>();
                
                for (ResumeDTO.ExperienceDTO expDTO : resumeDTO.getExperiences()) {
                    if (expDTO.getTitle() != null && expDTO.getCompany() != null) {
                        Experience exp = new Experience();
                        exp.setTitle(expDTO.getTitle());
                        exp.setCompany(expDTO.getCompany());
                        exp.setAddress(expDTO.getAddress());
                        exp.setStartDate(expDTO.getStartDate());
                        exp.setEndDate(expDTO.getEndDate());
                        exp.setSummary(expDTO.getSummary());
                        exp.setResume(savedResume);  // Link to parent resume
                        
                        experiences.add(exp);
                    }
                }
                
                savedResume.setExperience(experiences);
            }
            
            // 4. Process education entries
            if (resumeDTO.getEducations() != null && !resumeDTO.getEducations().isEmpty()) {
                List<Education> educations = new ArrayList<>();
                
                for (ResumeDTO.EducationDTO eduDTO : resumeDTO.getEducations()) {
                    if (eduDTO.getName() != null && eduDTO.getQualification() != null) {
                        Education edu = new Education();
                        edu.setName(eduDTO.getName());
                        edu.setAddress(eduDTO.getAddress());
                        edu.setQualification(eduDTO.getQualification());
                        edu.setYear(eduDTO.getYear());
                        edu.setResume(savedResume);  // Link to parent resume
                        
                        educations.add(edu);
                    }
                }
                
                savedResume.setEducation(educations);
            }
            
            // 5. Process skills
            if (resumeDTO.getSkills() != null && !resumeDTO.getSkills().isEmpty()) {
                List<Skill> skills = new ArrayList<>();
                
                for (ResumeDTO.SkillDTO skillDTO : resumeDTO.getSkills()) {
                    if (skillDTO.getName() != null) {
                        Skill skill = new Skill();
                        skill.setName(skillDTO.getName());
                        skill.setLevel(skillDTO.getLevel());
                        skill.setResume(savedResume);  // Link to parent resume
                        
                        skills.add(skill);
                    }
                }
                
                savedResume.setSkills(skills);
            }
            
            // 6. Save the complete resume with all its relationships in one go
            // This will cascade save all the child entities due to the CascadeType.ALL
            // configuration in the Resume entity
            Resume finalResume = resumeService.updateResume(savedResume.getId(), savedResume);
            
            return ResponseEntity.ok(finalResume);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long id) {
        try {
            Resume resume = resumeService.getResume(id);
            if (resume == null) {
                return ResponseEntity.notFound().build();
            }

            byte[] pdfBytes = pdfService.generateCV(resume);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (StackOverflowError e) {
            // This can happen with very large resumes or infinite recursion
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("PDF generation failed: Resume data is too complex".getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}