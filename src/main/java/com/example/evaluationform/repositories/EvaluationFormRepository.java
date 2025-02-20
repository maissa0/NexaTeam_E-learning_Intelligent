package com.example.evaluationform.repositories;

import com.example.evaluationform.model.EvaluationForm;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EvaluationFormRepository extends MongoRepository<EvaluationForm, String> {
}
