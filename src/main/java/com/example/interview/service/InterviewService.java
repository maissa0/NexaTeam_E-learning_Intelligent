package com.example.interview.service;

import com.example.interview.model.Interview;
import com.example.interview.repositories.InterviewRepository;
import com.example.interview.interfaces.InterviewInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService implements InterviewInterface {

    @Autowired
    private InterviewRepository interviewRepository;
private ZoomService zoomService;
    public InterviewService(InterviewRepository interviewRepository, ZoomService zoomService) {
        this.interviewRepository = interviewRepository;
        this.zoomService = zoomService;
    }
    @Override
    public Interview createInterview(Interview interview) {
        if (interview.getScheduledDateTime() != null) {
            // Convert LocalDateTime to ISO 8601 format for Zoom API
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
            String isoScheduledDate = interview.getScheduledDateTime().format(formatter);

            // 🔹 Create Zoom meeting and store the meeting link
            String meetingLink = zoomService.createZoomMeeting(isoScheduledDate);
            interview.setMeetingLink(meetingLink);
        }
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