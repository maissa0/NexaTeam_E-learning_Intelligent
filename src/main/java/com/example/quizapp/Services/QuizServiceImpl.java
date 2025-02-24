package com.example.quizapp.Services;


import com.example.quizapp.Entities.Question;
import com.example.quizapp.Entities.Quiz;
import com.example.quizapp.Entities.QuizResult;
import com.example.quizapp.Entities.User;
import com.example.quizapp.Repo.QuestionRepository;
import com.example.quizapp.Repo.QuizRepository;
import com.example.quizapp.Repo.QuizResultRepository;
import com.example.quizapp.Repo.UserRepository;
import com.example.quizapp.dto.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizResultRepository quizResultRepository;
    @Autowired
    private UserRepository userRepository;


    public QuizDto createQuiz(QuizDto dto){
         Quiz quiz = new Quiz();
         quiz.setTitle(dto.getTitle());
         quiz.setDescrption(dto.getDescrption());
         quiz.setTime(dto.getTime());


         return quizRepository.save(quiz).getDto();
    }
    public QuestionDto addQuestionInQuiz(QuestionDto dto) {
        Quiz quiz = quizRepository.findById(dto.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé avec ID: " + dto.getQuizId()));

            Question question = new Question();

            question.setQuestionText(dto.getQuestionText());

            question.setOptionA(dto.getOptionA());

            question.setOptionB(dto.getOptionB());

            question.setOptionC(dto.getOptionC());

            question.setOptionD(dto.getOptionD());

            question.setCorrectOption(dto.getCorrectOption());
            question.setQuiz(quiz);


            return questionRepository.save(question).getDto();



    }
    public List<QuizDto> getAllQuizes() {
        return quizRepository.findAll().stream()
                .peek(quiz -> quiz.setTime(quiz.getQuestions().size() * quiz.getTime()))
                .collect(Collectors.toList())
                .stream().map(Quiz::getDto).collect(Collectors.toList());

    }
    public QuizDetailsDto getAllQuestionsByQuiz (Long id) {

        Optional<Quiz> optionalQuiz = quizRepository.findById(id);

        QuizDetailsDto quizDetailsDTO = new QuizDetailsDto();

        if(optionalQuiz.isPresent()){

            QuizDto quizDto = optionalQuiz.get().getDto();

            quizDto.setTime(optionalQuiz.get().getTime() * optionalQuiz.get().getQuestions().size());

            quizDetailsDTO.setQuizDto(quizDto);

            quizDetailsDTO.setQuestions(optionalQuiz.get().getQuestions().stream().map(Question::getDto).toList());

            return quizDetailsDTO;

        }

        return quizDetailsDTO;

    }
    @Transactional
    public QuizResultDto submitTest(SubmitQuizDto request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new EntityNotFoundException("Test not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        int correctAnswers = 0;
        for (QuestionResponse response : request.getResponses()) {
            System.out.println("Responses size: " + request.getResponses().size());
            Question question = questionRepository.findById(response.getQuestionId())
                    .orElseThrow(() -> new EntityNotFoundException("Question not found"));

            if (question.getCorrectOption().trim().equalsIgnoreCase(response.getSelectedOption().trim())) {
                System.out.println("✅ MATCH: " + question.getCorrectOption() + " == " + response.getSelectedOption());
                correctAnswers++;
            } else {
                System.out.println("❌ NO MATCH: Expected: [" + question.getCorrectOption() + "] | Selected: [" + response.getSelectedOption() + "]");
            }
        }

        int totalQuestions = quiz.getQuestions().size();
        System.out.println("Total Questions: " + totalQuestions);
        System.out.println("============================================="+totalQuestions);
        System.out.println("///////////////////////////////"+correctAnswers);
        double percentage = ((double) correctAnswers / totalQuestions) * 100;
        System.out.println("============================================="+percentage);
        QuizResult quizResult = new QuizResult();
        quizResult.setQuiz(quiz);
        quizResult.setUser(user);
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setCorrectAnswers(correctAnswers);
        quizResult.setPercentage(percentage);

        return quizResultRepository.save(quizResult).getDto();
    }
    public List<QuizResultDto> getALLQuizesults(){

        return quizResultRepository.findAll().stream()
                .map(QuizResult::getDto)
                .collect(Collectors.toList());
    }
    public List<QuizResultDto> getAllQuizResultsOfUser(Long userId){
        return quizResultRepository.findAllByUserId(userId).stream().map(QuizResult::getDto).collect(Collectors.toList());
    }
}
