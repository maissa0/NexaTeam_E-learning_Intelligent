package com.applications.hrmanagement.Services;
import com.applications.hrmanagement.DTO.JobApplicationDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IJobApplicationService {
    JobApplicationDTO createJobApplication(JobApplicationDTO jobApplicationDTO);
    JobApplicationDTO getJobApplicationById(String id);
    List<JobApplicationDTO> getAllJobApplications();
    JobApplicationDTO updateJobApplication(String id, JobApplicationDTO jobApplicationDTO);
    void deleteJobApplication(String id);

}
