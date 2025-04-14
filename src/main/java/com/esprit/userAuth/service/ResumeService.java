package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Resume;
import com.esprit.userAuth.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Resume> getUserResumes(String userEmail) {
        return resumeRepository.findByUserEmail(userEmail);
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