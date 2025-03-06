import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { QuizServiceService } from '../service/quiz-service.service';
import { AdminService } from '../service/admin-service.service';
import { CommonModule } from '@angular/common'; 



@Component({
  selector: 'app-generated-quiz',
  imports: [CommonModule],
  template: `      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

  <div *ngIf="quizQuestions.length > 0" class="card">
    <div class="card-content">
      <h2 class="quiz-title">Exemples of Quizes  !</h2>
      
      <div *ngFor="let question of quizQuestions; let i = index" class="question-container">
        <h3 class="question">{{ i + 1 }}. {{ question.question }}</h3>
        
        <div *ngFor="let option of question.incorrect_answers.concat(question.correct_answer)" class="option-container">
          <label class="option-label">
            <input type="radio" name="question{{ i }}" value="{{ option }}" class="option-input">
            {{ option }}
          </label>
        </div>
      </div>
    </div>
  </div>
  
  <div *ngIf="quizQuestions.length === 0 && !errorMessage" class="loading-message">
    <p>Chargement du quiz...</p>
  </div>
`,
styles: [`
  /* Style pour le message d'erreur */
  .error-message {
    color: white;
    background-color: #e74c3c;
    padding: 15px;
    border-radius: 8px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    font-size: 16px;
  }

  /* Carte pour le quiz */
  .card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 40px auto;
    overflow: hidden;
    padding: 20px;
  }

  .card-content {
    padding: 20px;
  }

  .quiz-title {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 20px;
  }

  .question-container {
    background-color: #ecf0f1;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .question {
    font-size: 18px;
    font-weight: 500;
    color: #34495e;
    margin-bottom: 10px;
  }

  .option-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
  }

  .option-label {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #7f8c8d;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.3s;
  }

  .option-label:hover {
    background-color: #bdc3c7;
    transform: translateY(-3px);
  }

  .option-input {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }

  /* Style pour le message de chargement */
  .loading-message {
    font-size: 18px;
    color: #7f8c8d;
    text-align: center;
    margin-top: 30px;
  }
`]
})
export class GeneratedQuizComponent {
  quizQuestions: any[] = [];  // Pour stocker les questions du quiz
  errorMessage: string = '';   // Pour afficher un message d'erreur

  constructor(private quizService: AdminService) { }

  ngOnInit(): void {
    this.loadQuiz();
  }

  // Méthode pour charger les questions du quiz
  loadQuiz(): void {
    this.quizService.generateQuizFromAPI().subscribe({
      next: (data) => {
        console.log(data);  // Affiche les données dans la console
        this.quizQuestions = data.results;  // Stocke les résultats du quiz
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du quiz!';
        console.error(error);
      }
    });
 
}
}

