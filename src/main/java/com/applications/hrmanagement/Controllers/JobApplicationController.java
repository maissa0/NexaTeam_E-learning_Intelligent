package com.applications.hrmanagement.Controllers;

import com.applications.hrmanagement.DTO.JobApplicationDTO;
import com.applications.hrmanagement.Services.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobApp")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping("/create")
    public JobApplicationDTO createJobApplication(@RequestBody JobApplicationDTO jobApplicationDTO) {
        return jobApplicationService.createJobApplication(jobApplicationDTO);
    }

    @GetMapping("/{id}")
    public JobApplicationDTO getJobApplication(@PathVariable String id) {
        return jobApplicationService.getJobApplicationById(id);
    }}

