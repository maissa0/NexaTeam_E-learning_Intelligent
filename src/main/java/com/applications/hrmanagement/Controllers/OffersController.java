package com.applications.hrmanagement.Controllers;

import com.applications.hrmanagement.DTO.JobOfferDto;
import com.applications.hrmanagement.DTO.offersDTO;
import com.applications.hrmanagement.Entities.jobOffer;
import com.applications.hrmanagement.Services.IofferService;
import com.applications.hrmanagement.Services.IjobOfferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/offersDisponibles")
public class OffersController {

    @Autowired
    private IofferService OffersService;

    @Autowired // Add this annotation to inject the jobService bean
    private IjobOfferService jobService;

    @GetMapping
    public List<offersDTO> getAllJobOffers() {
        return OffersService.getAllJobOffers();
    }

    @GetMapping("/{id}")
    public jobOffer getJobOfferById(@PathVariable String id) {
        // Logique pour récupérer une offre d'emploi par son ID
        return jobService.getJobOfferById(id);
    }
}