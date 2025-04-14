package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Resume;
import com.esprit.userAuth.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository resumeRepository;

    public Resume createResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public Resume getResume(Long id) {
        return resumeRepository.findById(id).orElse(null);
    }

    /**
     * Get a resume by ID with all its associated data (experiences, educations, skills)
     * explicitly loaded
     * 
     * @param id The resume ID
     * @return The resume with all associated data
     */
    @Transactional
    public Resume getResumeWithDetails(Long id) {
        Resume resume = resumeRepository.findById(id).orElse(null);
        if (resume != null) {
            // Force initialization of lazy collections
            resume.getExperience().size();
            resume.getEducation().size();
            resume.getSkills().size();
        }
        return resume;
    }

    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserId(userId);
    }

    /**
     * Get all resumes for a user with complete details including experiences, 
     * education, and skills fully initialized
     * 
     * @param userId The user ID to get resumes for
     * @return List of detailed resumes with all associations loaded
     */
    @Transactional
    public List<Resume> getUserResumesWithDetails(Long userId) {
        List<Resume> resumes = resumeRepository.findByUserId(userId);
        return resumes.stream()
            .map(resume -> {
                // Force initialization of lazy collections
                resume.getExperience().size();
                resume.getEducation().size();
                resume.getSkills().size();
                return resume;
            })
            .collect(Collectors.toList());
    }

    public Resume updateResume(Long id, Resume resume) {
        if (resumeRepository.existsById(id)) {
            resume.setId(id);
            return resumeRepository.save(resume);
        }
        return null;
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
} 