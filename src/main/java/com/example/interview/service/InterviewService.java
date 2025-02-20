package com.example.interview.service;

import com.example.interview.model.Interview;
import com.example.interview.repository.InterviewRepository;
import com.example.interview.interfaces.InterviewInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewService implements InterviewInterface {

    @Autowired
    private InterviewRepository interviewRepository;

    @Override
    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    @Override
    public Optional<Interview> getInterviewById(String interviewId) {
        return interviewRepository.findById(interviewId);
    }

    @Override
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    @Override
    public Interview updateInterview(String interviewId, Interview interview) {
        if (interviewRepository.existsById(interviewId)) {
            interview.setInterviewId(interviewId);
            return interviewRepository.save(interview);
        } else {
            throw new RuntimeException("Interview not found with id: " + interviewId);
        }
    }

    @Override
    public void deleteInterview(String interviewId) {
        interviewRepository.deleteById(interviewId);
    }
}