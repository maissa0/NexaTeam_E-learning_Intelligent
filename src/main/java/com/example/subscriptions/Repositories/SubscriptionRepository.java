package com.example.subscriptions.Repositories;

import com.example.subscriptions.Entities.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {

    List<Subscription> findByStatus(String status);
}
