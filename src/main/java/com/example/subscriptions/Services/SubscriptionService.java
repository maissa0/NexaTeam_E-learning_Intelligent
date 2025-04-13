package com.example.subscriptions.Services;


import com.example.subscriptions.Dto.SubscriptionDto;
import com.example.subscriptions.Entities.Subscription;
import com.example.subscriptions.Repositories.SubscriptionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService implements Iservice{

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    // Assuming you have a UserRepository for user handling

    // Create Subscription
    public SubscriptionDto createSubscription(SubscriptionDto dto) {
        Subscription subscription = new Subscription();
        subscription.setPlanName(dto.getPlanName());
        subscription.setDescription(dto.getDescription());
        subscription.setPrice(dto.getPrice());
        subscription.setStatus(dto.getStatus());
        subscription.setExpiryDate(dto.getExpiryDate());

        // Save the subscription and convert it to DTO
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return convertToDto(savedSubscription);
    }

    // Update Subscription
    public SubscriptionDto updateSubscription(Long id, SubscriptionDto dto) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found with ID: " + id));

        subscription.setPlanName(dto.getPlanName());
        subscription.setDescription(dto.getDescription());
        subscription.setPrice(dto.getPrice());
        subscription.setStatus(dto.getStatus());
        subscription.setExpiryDate(dto.getExpiryDate());

        // Save the updated subscription and return the DTO
        return convertToDto(subscriptionRepository.save(subscription));
    }

    // Get all subscriptions
    public List<SubscriptionDto> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get Subscription by ID
    public SubscriptionDto getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found with ID: " + id));
        return convertToDto(subscription);
    }

    // Delete Subscription
    @Transactional
    public void deleteSubscription(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new EntityNotFoundException("Subscription not found with ID: " + id);
        }
        subscriptionRepository.deleteById(id);
    }

    // Convert Subscription to DTO
    private SubscriptionDto convertToDto(Subscription subscription) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(subscription.getId()); // Set the id

        dto.setPlanName(subscription.getPlanName());
        dto.setDescription(subscription.getDescription());
        dto.setPrice(subscription.getPrice());
        dto.setStatus(subscription.getStatus());
        dto.setExpiryDate(subscription.getExpiryDate());
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        return dto;
    }

    @Transactional
    public void handleExpiredSubscriptions() {
        List<Subscription> subscriptions = subscriptionRepository.findByStatus("ACTIVE");

        for (Subscription subscription : subscriptions) {
            if (subscription.getExpiryDate().isBefore(LocalDate.now())) {
                subscription.setStatus("EXPIRED");
                subscriptionRepository.save(subscription);
            }
        }
    }
}
