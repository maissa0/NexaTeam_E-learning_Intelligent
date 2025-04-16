package com.example.evaluationform.controllers;

import com.example.evaluationform.model.EvaluationForm;
import com.example.evaluationform.service.EvaluationFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/evaluationForms")
public class EvaluationFormController {

    @Autowired
    private EvaluationFormService evaluationFormService;

    @PostMapping("/create")
    public ResponseEntity<EvaluationForm> createEvaluationForm(@RequestBody EvaluationForm evaluationForm) {
        EvaluationForm createdEvaluationForm = evaluationFormService.createEvaluationForm(evaluationForm);
        return ResponseEntity.ok(createdEvaluationForm);
    }

    @GetMapping("/getByApplicationId/{applicationId}")
    public ResponseEntity<EvaluationForm> getEvaluationFormByApplicationId(@PathVariable String applicationId) {
        Optional<EvaluationForm> evaluationForm = evaluationFormService.getEvaluationFormByApplicationId(applicationId);
        return evaluationForm.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getbyId/{id}")
    public ResponseEntity<EvaluationForm> getEvaluationFormById(@PathVariable String id) {
        Optional<EvaluationForm> evaluationForm = evaluationFormService.getEvaluationFormById(id);
        return evaluationForm.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<EvaluationForm>> getAllEvaluationForms() {
        List<EvaluationForm> evaluationForms = evaluationFormService.getAllEvaluationForms();
        return ResponseEntity.ok(evaluationForms);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EvaluationForm> updateEvaluationForm(@PathVariable String id, @RequestBody EvaluationForm evaluationForm) {
        try {
            EvaluationForm updatedEvaluationForm = evaluationFormService.updateEvaluationForm(id, evaluationForm);
            return ResponseEntity.ok(updatedEvaluationForm);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvaluationForm(@PathVariable String id) {
        evaluationFormService.deleteEvaluationForm(id);
        return ResponseEntity.noContent().build();
    }
}