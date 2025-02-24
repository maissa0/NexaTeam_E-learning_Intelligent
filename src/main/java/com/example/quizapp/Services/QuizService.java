package com.example.quizapp.Services;

import com.example.quizapp.Entities.Quiz;
import com.example.quizapp.dto.*;

import java.util.List;

public interface QuizService {

    QuizDto createQuiz(QuizDto dto);
    QuestionDto addQuestionInQuiz(QuestionDto dto);
    List<QuizDto> getAllQuizes();
    QuizDetailsDto getAllQuestionsByQuiz (Long id);
    QuizResultDto submitTest(SubmitQuizDto request);
    List<QuizResultDto> getALLQuizesults();
    List<QuizResultDto> getAllQuizResultsOfUser(Long userId);
}
