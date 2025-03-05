package com.applications.hrmanagement.Controllers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.applications.hrmanagement.DTO.JobApplicationDTO;
import com.applications.hrmanagement.Services.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/jobApp")

public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;


    private static final Logger logger = LoggerFactory.getLogger(JobApplicationController.class);


    @Autowired
    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping("/create")
    public JobApplicationDTO createJobApplication(@Valid @RequestBody JobApplicationDTO jobApplicationDTO) {
        logger.info("Received request to create job application: {}", jobApplicationDTO);
        JobApplicationDTO createdApplication = jobApplicationService.createJobApplication(jobApplicationDTO);
        logger.info("Job application created successfully: {}", createdApplication);
        return createdApplication;
    }

    @GetMapping("/{id}")
    public JobApplicationDTO getJobApplication(@PathVariable String id) {
        return jobApplicationService.getJobApplicationById(id);
    }
    @GetMapping("/all")
    public List<JobApplicationDTO> getAllJobApplications(){
    return jobApplicationService.getAllJobApplications();
}}

