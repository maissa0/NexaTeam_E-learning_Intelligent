import { Component } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../services/user-storage.service';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.component.html',
  styleUrls: ['./start-quiz.component.css']
})
export class StartQuizComponent {
  [x: string]: any;

  questions: any[] = [];
  quizId:any;
  userId:any;


  selectedAnswers: { [key: string]: string } = {};
  timeRemaining:number=300; 
  message:string='';
  messageType:string='';// Ensures TypeScript knows the structure

  constructor(private quizService: QuizService,
    private activateRoute:ActivatedRoute , private route :Router) { }
    ngOnInit() {
      this.activateRoute.paramMap.subscribe(params => {
        const quizIdParam = params.get('id');
        
        if (quizIdParam) {
          this.quizId = +quizIdParam; // Convert to number if it's not null
          this.quizService.getQuizQuestion(this.quizId).subscribe(res => {
            this.questions = res.questions;
            console.log(this.questions);
            this.timeRemaining = +res.QuizDto.time || 0; 
          });
        } else {
          console.error('Quiz ID not found in the route params.');
          // Handle the case where QuizId is not available, if necessary
        }
      });
    }
    getFormattedTime(): string {
  const minutes = Math.floor(this.timeRemaining / 60);  // Get minutes
  const seconds = this.timeRemaining % 60;  // Get seconds
  return `${minutes} minutes ${seconds} seconds`;
}


    onAnswerChange(questionId: number, selectedOption: string) {
      this.selectedAnswers[questionId] = selectedOption;
      console.log(this.selectedAnswers);
    }
    submitAnswers() {
      const answerList = Object.keys(this.selectedAnswers).map(questionId => ({
        questionId: +questionId,
        selectedOption: this.selectedAnswers[questionId]
      }));
    
      const data = {
        quizId: this.quizId,
        userId: 2, // Temporary default user ID
        responses: answerList
      };
    
      console.log('Submitting Data:', data); // Debugging
    
      this.quizService.submitQuiz(data).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.message = 'Quiz submitted successfully!';
          this.messageType = 'success';
          setTimeout(() => this.route.navigate(['user-dashboard']), 2000);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.message  = 'Failed to submit quiz. Please try again.';
          this.messageType = 'error';
        }
      });
    }
    
    
    
  

}
