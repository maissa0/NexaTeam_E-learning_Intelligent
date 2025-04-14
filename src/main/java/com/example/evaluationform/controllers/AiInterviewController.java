package com.example.evaluationform.controllers;

import com.example.evaluationform.model.JobOfferRequest;
import com.example.evaluationform.model.QuestionReponse;
import com.example.evaluationform.service.AiInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview-questions")
@CrossOrigin(origins = "*")
public class AiInterviewController {

    @Autowired
    private AiInterviewService aiService;

    @PostMapping
    public List<QuestionReponse> generateQuestions(@RequestBody JobOfferRequest request) {
        return aiService.generateQuestions(request);
    }
}
