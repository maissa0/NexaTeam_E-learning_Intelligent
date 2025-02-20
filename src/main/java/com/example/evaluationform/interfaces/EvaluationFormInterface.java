package com.example.evaluationform.interfaces;

import com.example.evaluationform.model.EvaluationForm;

import java.util.List;
import java.util.Optional;

public interface EvaluationFormInterface {

    EvaluationForm createEvaluationForm(EvaluationForm evaluationForm);

    Optional<EvaluationForm> getEvaluationFormById(String evaluationId);

    List<EvaluationForm> getAllEvaluationForms();

    EvaluationForm updateEvaluationForm(String evaluationId, EvaluationForm evaluationForm);

    void deleteEvaluationForm(String evaluationId);
}