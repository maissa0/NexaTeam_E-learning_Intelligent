package com.example.interview.interfaces;

import com.example.interview.model.Interview;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Optional;

public interface InterviewInterface {

    Interview createInterview(Interview interview) throws IOException, GeneralSecurityException;

    Optional<Interview> getInterviewById(String interviewId);

    List<Interview> getAllInterviews();

    Interview updateInterview(String interviewId, Interview interview);

    void deleteInterview(String interviewId);
}

