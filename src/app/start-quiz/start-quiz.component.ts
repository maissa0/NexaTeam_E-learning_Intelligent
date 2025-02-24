import { Component } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../services/user-storage.service';
import { interval } from 'rxjs';

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
  quizTitle:any;


  selectedAnswers: { [key: string]: string } = {};
  timeRemaining:number=300; 
  message:string='';
  messageType:string='';// Ensures TypeScript knows the structure
  interval: any; 
  constructor(private quizService: QuizService,
    private activateRoute:ActivatedRoute , private route :Router) { }
    ngOnInit() {
      this.activateRoute.paramMap.subscribe(params => {
        const quizIdParam = params.get('id');
        
        if (quizIdParam) {
          this.quizId = +quizIdParam; // Convert to number if it's not null
          
          // Fetch quiz questions and details using the getQuizQuestion method
          this.quizService.getQuizQuestion(this.quizId).subscribe(res => {
            console.log('API Response:', res); // Debugging step
            
            this.questions = res?.questions || []; // Ensure questions array is not undefined
            console.log('Questions:', this.questions);
    
            if (res?.quizDto) {
              this.quizTitle = res.quizDto.title; // Store quiz title from the quizDto
              console.log('Quiz Title:', this.quizTitle);
    
              this.timeRemaining = Number(res.quizDto.time) || 300; // Set quiz time
              this.startTimer(); // Start timer based on the quiz time
            } else {
              console.error('quizDto is undefined in API response:', res);
              this.timeRemaining = 300; // Default fallback time if no time found
            }
    
            console.log('Quiz Time Set:', this.timeRemaining);
          });
        } else {
          console.error('Quiz ID not found in the route params.');
          // Handle the case where QuizId is not available, if necessary
        }
      });
    }
    
    startTimer() {
      this.interval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          clearInterval(this.interval);
          this.submitAnswers();
        }
      }, 1000);
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
