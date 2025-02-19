package com.applications.hrmanagement.Controllers;
import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Services.IjobOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;




@RestController
@RequestMapping("/api/job-offers")
public class JobOfferController {

    @Autowired
    private IjobOfferService jobOfferService;

    @PostMapping("/addOffer")
    public jobOffer createJobOffer(@RequestBody JobOfferDto jobOfferDTO) {
        return jobOfferService.createJobOffer(jobOfferDTO);
    }

    @GetMapping("getbyID/{id}")
    public jobOffer getJobOfferById(@PathVariable String id) {
        return jobOfferService.getJobOfferById(id);
    }

    @GetMapping
    public List<jobOffer> getAllJobOffers() {
        return jobOfferService.getAllJobOffers();
    }

    @PutMapping("update/{id}")
    public jobOffer updateJobOffer(@PathVariable String id, @RequestBody JobOfferDto jobOfferDTO) {
        return jobOfferService.updateJobOffer(id, jobOfferDTO);
    }

    @DeleteMapping("Delete/{id}")
    public void deleteJobOffer(@PathVariable String id) {
        jobOfferService.deleteJobOffer(id);
    }
}
