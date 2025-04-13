package com.example.subscriptions.Services;

import com.example.subscriptions.Dto.SubscriptionDto;

import java.util.List;

public interface Iservice {
    SubscriptionDto createSubscription(SubscriptionDto dto);

    SubscriptionDto updateSubscription(Long id, SubscriptionDto dto);

    List<SubscriptionDto> getAllSubscriptions();

    SubscriptionDto getSubscriptionById(Long id);

    void deleteSubscription(Long id);
    void handleExpiredSubscriptions();
}
