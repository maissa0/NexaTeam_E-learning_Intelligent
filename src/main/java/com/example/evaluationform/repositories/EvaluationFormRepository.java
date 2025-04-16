package com.example.evaluationform.repositories;

import com.example.evaluationform.model.EvaluationForm;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EvaluationFormRepository extends MongoRepository<EvaluationForm, String> {
    Optional<EvaluationForm> findByApplicationId(String applicationId);
}
