package com.example.subscriptions.Controllers;


import com.example.subscriptions.Dto.SubscriptionDto;
import com.example.subscriptions.Entities.Subscription;
import com.example.subscriptions.Repositories.SubscriptionRepository;
import com.example.subscriptions.Services.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class SubscriptionRestController {
    @Autowired
    private SubscriptionService subscriptionService;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    // Create a new subscription
    @PostMapping("/subscription")
    public ResponseEntity<?> createSubscription(@RequestBody SubscriptionDto dto) {
        try {
            return new ResponseEntity<>(subscriptionService.createSubscription(dto), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all subscriptions
    @GetMapping("/subscriptions")
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();  // This will return a list of subscriptions with their 'id' field.
    }

    @DeleteMapping("/subscription/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionRepository.deleteById(id);  // Deletes subscription by ID.
    }

    // Get a subscription by its ID
    @GetMapping("/subscription/{id}")
    public ResponseEntity<?> getSubscriptionById(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(subscriptionService.getSubscriptionById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update a subscription
    @PutMapping("/subscription/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody SubscriptionDto dto) {
        try {
            return new ResponseEntity<>(subscriptionService.updateSubscription(id, dto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a subscription


    // Check and handle expired subscriptions
    @PostMapping("/subscription/handle-expired")
    public ResponseEntity<?> handleExpiredSubscriptions() {
        try {
            subscriptionService.handleExpiredSubscriptions();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expired subscriptions handled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/subscription/{id}/status")
    public ResponseEntity<String> getSubscriptionStatus(@PathVariable Long id) {
        Optional<Subscription> subscription = subscriptionRepository.findById(id);

        if (subscription.isPresent()) {
            Subscription sub = subscription.get();
            String status = sub.getStatus();  // "active", "expired", etc.
            return ResponseEntity.ok(status);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found");
    }

}
