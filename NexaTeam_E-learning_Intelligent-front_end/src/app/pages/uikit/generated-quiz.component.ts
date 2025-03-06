import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { QuizServiceService } from '../service/quiz-service.service';
import { AdminService } from '../service/admin-service.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // Importer FormsModule ici




@Component({
  selector: 'app-generated-quiz',
  imports: [CommonModule,FormsModule],
  template: `       <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

  <div *ngIf="quizQuestions.length > 0" class="card">
    <div class="card-content">
      <h2 class="quiz-title">Exemples of Quizzes!</h2>
      
      <form (ngSubmit)="submitQuiz()">
        <div *ngFor="let question of quizQuestions; let i = index" class="question-container">
          <h3 class="question">{{ i + 1 }}. {{ question.question }}</h3>
          
          <div *ngFor="let option of shuffledOptions(i)" class="option-container">
            <label class="option-label">
              <input 
                type="radio" 
                name="question{{ i }}" 
                [value]="option" 
                [(ngModel)]="userAnswers[i]"
                class="option-input"
              >
              {{ option }}
            </label>
          </div>
        </div>
        
        <div class="text-center mt-4">
          <button type="submit" class="btn-submit">Submit Quiz</button>
        </div>
      </form>
    </div>
  </div>

  <div *ngIf="quizQuestions.length === 0 && !errorMessage" class="loading-message">
    <p>Chargement du quiz...</p>
  </div>

  <div *ngIf="score !== null" class="text-center mt-4">
    <h3>Votre score : {{ score }} / {{ quizQuestions.length }}</h3>
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
  /* Style du bouton moderne */
.btn-submit {
  background-color: #3498db; /* Couleur bleue moderne */
  color: #fff; /* Texte en blanc */
  border: none; /* Pas de bordure */
  padding: 15px 30px; /* Espacement interne (padding) */
  font-size: 18px; /* Taille de la police */
  font-weight: 600; /* Poids de la police */
  border-radius: 50px; /* Bords arrondis */
  transition: all 0.3s ease; /* Transition pour les changements de style */
  cursor: pointer; /* Curseur pointer */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Ombre portée légère */
}

.btn-submit:hover {
  background-color: #2980b9; /* Couleur de fond plus sombre au survol */
  transform: translateY(-3px); /* Légère élévation du bouton */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Ombre plus marquée au survol */
}

.btn-submit:active {
  background-color: #1abc9c; /* Couleur différente lors de l'activation */
  transform: translateY(0); /* Retirer l'effet de translation */
}

.btn-submit:focus {
  outline: none; /* Supprimer la bordure de focus par défaut */
}

`]
})
export class GeneratedQuizComponent {
  quizQuestions: any[] = [];  // Pour stocker les questions du quiz
  errorMessage: string = ''; 
  userAnswers: string[] = [];  // Pour stocker les réponses de l'utilisateur
  score: number | null = null; // Pour afficher le score de l'utilisateur

    // Pour afficher un message d'erreur

  constructor(private quizService: AdminService) { }

  ngOnInit(): void {
    this.loadQuiz();
  }

  // Méthode pour charger les questions du quiz
  loadQuiz(): void {
    this.quizService.generateQuizFromAPI().subscribe({
      next: (data) => {
        console.log(data);  // Affiche les données dans la console
        this.quizQuestions = data.results;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du quiz!';
        console.error(error);
      }
      
    });
} shuffledOptions(i: number): string[] {
  const options = [
    ...this.quizQuestions[i].incorrect_answers,
    this.quizQuestions[i].correct_answer
  ];
  return this.shuffle(options);
}

// Algorithme de mélange (Fisher-Yates)
shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Méthode pour soumettre le quiz
submitQuiz(): void {
  this.score = 0; // Réinitialiser le score à chaque soumission

  // Comparer les réponses de l'utilisateur avec les réponses correctes
  this.quizQuestions.forEach((question, index) => {
    if (this.userAnswers[index] === question.correct_answer) {
      this.score = this.score ?? 0;
      this.score++;  // Incrémenter le score si la réponse est correcte
    }
  });
}
}

