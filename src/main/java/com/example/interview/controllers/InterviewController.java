package com.example.interview.controllers;

import com.example.interview.model.Interview;
import com.example.interview.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/create")
    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview) {
        try {
            Interview savedInterview = interviewService.createInterview(interview);
            return ResponseEntity.ok(savedInterview);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



    @GetMapping("/getById/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable String id) {
        Optional<Interview> interview = interviewService.getInterviewById(id);
        return interview.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Interview>> getAllInterviews() {
        List<Interview> interviews = interviewService.getAllInterviews();
        return ResponseEntity.ok(interviews);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable String id, @RequestBody Interview interview) {
        try {
            Interview updatedInterview = interviewService.updateInterview(id, interview);
            return ResponseEntity.ok(updatedInterview);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable String id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}