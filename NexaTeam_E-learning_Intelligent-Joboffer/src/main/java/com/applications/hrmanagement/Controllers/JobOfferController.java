package com.applications.hrmanagement.Controllers;
import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Services.IjobOfferService;
import com.applications.hrmanagement.Services.AIDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;




@RestController
@RequestMapping("/api/job-offers")
public class JobOfferController {

    @Autowired
    private IjobOfferService jobOfferService;

    @Autowired
    private AIDescriptionService aiDescriptionService;

    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(@RequestBody JobOfferDto jobOfferDTO) {
        String description = aiDescriptionService.generateDescription(jobOfferDTO);
        return ResponseEntity.ok(description);
    }

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
    @PostMapping("/search")
    public ResponseEntity<List<jobOffer>> searchJobOffers(@RequestBody JobOfferDto searchDTO) {
        List<jobOffer> jobOffers = jobOfferService.searchJobOffers(searchDTO);
        return ResponseEntity.ok(jobOffers);
    }
    @GetMapping("/{id}/view")
    public ResponseEntity<jobOffer> viewJobOfferDetails(@PathVariable String id) {
        jobOffer jobOffer = jobOfferService.incrementViewCount(id);
        return ResponseEntity.ok(jobOffer);
    }
    /*@GetMapping("/most-viewed")
    public ResponseEntity<List<jobOffer>> getMostViewedJobOffers(
            @RequestParam(defaultValue = "5") int limit) {
        List<jobOffer> mostViewedJobOffers = jobOfferService.getMostViewedJobOffers(limit);
        return ResponseEntity.ok(mostViewedJobOffers);
    }*/
}
