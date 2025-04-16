package com.example.evaluationform.service;

import com.example.evaluationform.interfaces.EvaluationFormInterface;
import com.example.evaluationform.model.EvaluationForm;
import com.example.evaluationform.repositories.EvaluationFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationFormService implements EvaluationFormInterface {

    @Autowired
    private EvaluationFormRepository evaluationFormRepository;

    @Override
    public EvaluationForm createEvaluationForm(EvaluationForm evaluationForm) {
        return evaluationFormRepository.save(evaluationForm);
    }

    @Override
    public Optional<EvaluationForm> getEvaluationFormById(String evaluationId) {
        return evaluationFormRepository.findById(evaluationId);
    }

    @Override
    public List<EvaluationForm> getAllEvaluationForms() {
        return evaluationFormRepository.findAll();
    }

    @Override
    public EvaluationForm updateEvaluationForm(String evaluationId, EvaluationForm evaluationForm) {
        if (evaluationFormRepository.existsById(evaluationId)) {
            evaluationForm.setEvaluationId(evaluationId);
            return evaluationFormRepository.save(evaluationForm);
        } else {
            throw new RuntimeException("EvaluationForm not found with id: " + evaluationId);
        }
    }


        public Optional<EvaluationForm> getEvaluationFormByApplicationId(String applicationId) {
            return evaluationFormRepository.findByApplicationId(applicationId);
        }


    @Override
    public void deleteEvaluationForm(String evaluationId) {
        evaluationFormRepository.deleteById(evaluationId);
    }
}