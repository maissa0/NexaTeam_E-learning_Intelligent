package com.esprit.userAuth.controller;

import com.esprit.userAuth.entity.Resume;
import com.esprit.userAuth.service.PDFService;
import com.esprit.userAuth.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final PDFService pdfService;

    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody Resume resume) {
        return ResponseEntity.ok(resumeService.createResume(resume));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable Long id) {
        Resume resume = resumeService.getResume(id);
        return resume != null ? ResponseEntity.ok(resume) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Resume>> getUserResumes(@PathVariable String userEmail) {
        return ResponseEntity.ok(resumeService.getUserResumes(userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @RequestBody Resume resume) {
        Resume updatedResume = resumeService.updateResume(id, resume);
        return updatedResume != null ? ResponseEntity.ok(updatedResume) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long id) {
        Resume resume = resumeService.getResume(id);
        if (resume == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] pdfBytes = pdfService.generateCV(resume);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "cv.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}