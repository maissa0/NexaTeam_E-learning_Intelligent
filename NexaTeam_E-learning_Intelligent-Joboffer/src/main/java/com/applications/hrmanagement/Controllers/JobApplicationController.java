package com.applications.hrmanagement.Controllers;

import com.applications.hrmanagement.DTO.JobApplicationDTO;
import com.applications.hrmanagement.Services.IJobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:63190", "http://localhost:4200"})
@RequestMapping("/api/jobApp")
public class JobApplicationController {

    @Autowired
    private IJobApplicationService jobApplicationService;

    @PostMapping("/create")
    public ResponseEntity<JobApplicationDTO> createJobApplication(@RequestBody JobApplicationDTO jobApplicationDTO) {
        JobApplicationDTO createdJobApplication = jobApplicationService.createJobApplication(jobApplicationDTO);
        return ResponseEntity.ok(createdJobApplication);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getJobApplicationById(@PathVariable String id) {
        JobApplicationDTO jobApplication = jobApplicationService.getJobApplicationById(id);
        if (jobApplication != null) {
            return ResponseEntity.ok(jobApplication);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobApplicationDTO>> getAllJobApplications() {
        List<JobApplicationDTO> jobApplications = jobApplicationService.getAllJobApplications();
        return ResponseEntity.ok(jobApplications);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<JobApplicationDTO> updateJobApplication(
            @PathVariable String id,
            @RequestBody JobApplicationDTO jobApplicationDTO) {
        JobApplicationDTO updatedJobApplication = jobApplicationService.updateJobApplication(id, jobApplicationDTO);
        if (updatedJobApplication != null) {
            return ResponseEntity.ok(updatedJobApplication);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteJobApplication(@PathVariable String id) {
        jobApplicationService.deleteJobApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobApplicationDTO>> getJobApplicationsByUserId(@PathVariable String userId) {
        List<JobApplicationDTO> jobApplications = jobApplicationService.getJobApplicationsByUserId(userId);
        return ResponseEntity.ok(jobApplications);
    }
}