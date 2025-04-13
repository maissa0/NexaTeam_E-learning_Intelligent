import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../service/admin-service.service';
import { QuizServiceService } from '../service/quiz-service.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-quiz',
  imports: [ReactiveFormsModule,
    CommonModule
  ],
  template: `<div class="bg">
  <div class="parent">
    <div class="child">
      <form [formGroup]="quizForm" class="login-form" (ngSubmit)="onSubmit()" autocomplete="off">
        <div *ngIf="message" class="notification" [ngClass]="messageType">
          {{ message }}
        </div>

        <!-- Title field -->
        <div class="form-item">
          <label for="title" class="form-label">Title</label>
          <div class="form-control">
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              [placeholder]="quizForm.get('title')?.value || 'Enter the title'" 
              class="input-field"
              aria-label="Quiz title"
              autocomplete="off"
            />
            <div *ngIf="quizForm.get('title')?.invalid && quizForm.get('title')?.touched" class="error-message">
              <span *ngIf="quizForm.get('title')?.errors?.['required']">Title is required.</span>
              <span *ngIf="quizForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters.</span>
            </div>
          </div>
        </div>

        <!-- Description field -->
        <div class="form-item">
          <label for="descrption" class="form-label">descrption</label>
          <div class="form-control">
            <textarea 
              id="descrption" 
              formControlName="descrption" 
              [placeholder]="quizForm.get('descrption')?.value || 'Describe the quiz...'" 
              class="input-field descrption-field" 
              rows="5"
              aria-label="Quiz descrption"
              autocomplete="off"
            ></textarea>
            <div *ngIf="quizForm.get('descrption')?.invalid && quizForm.get('descrption')?.touched" class="error-message">
              <span *ngIf="quizForm.get('descrption')?.errors?.['required']">descrption is required.</span>
              <span *ngIf="quizForm.get('descrption')?.errors?.['minlength']">descrption must be at least 10 characters.</span>
            </div>
          </div>
        </div>

        <!-- Time field -->
        <div class="form-item">
          <label for="time" class="form-label">Time Per Question</label>
          <div class="form-control">
            <input 
              type="number" 
              id="time" 
              formControlName="time" 
              [placeholder]="quizForm.get('time')?.value || 'Enter time in seconds'" 
              class="input-field" 
              aria-label="Time per question"
              autocomplete="off"
            />
            <div *ngIf="quizForm.get('time')?.invalid && quizForm.get('time')?.touched" class="error-message">
              <span *ngIf="quizForm.get('time')?.errors?.['required']">Time is required.</span>
              <span *ngIf="quizForm.get('time')?.errors?.['min']">Time must be at least 5 seconds.</span>
            </div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="form-item">
          <button type="submit" [disabled]="quizForm.invalid" class="submit-button">Submit</button>
        </div>

      </form>
    </div>
  </div>
</div>

`,
  styles: `.bg {
    background-color: #f4f4f4;
    padding: 50px 20px; /* Added padding around */
    height: 100vh; /* Full viewport height */
    display: flex;
    justify-content: center;
    align-items: center; /* Vertically center the content */
  }
  
  /* Centering the form */
  .parent {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  /* Child container (form) style */
  .child {
    width: 100%;
    max-width: 500px;
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Improved box-shadow */
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between form fields */
  }
  
  /* Form layout */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between form items */
  }
  
  /* Style for each form item */
  .form-item {
    display: flex;
    flex-direction: column;
  }
  
  /* Label styling */
  .form-label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #333; /* Darker color for label */
  }
  
  /* Form control styling (inputs and textareas) */
  .form-control {
    display: flex;
    flex-direction: column;
    gap: 6px; /* Space between input and error message */
  }
  
  .input-field {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }
  
  .input-field:focus {
    border-color: #003973; /* Focus effect on input */
    outline: none;
  }
  
  .descrption-field {
    resize: vertical; /* Allow vertical resizing */
    min-height: 100px;
  }
  
  /* Error message style */
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
  
  /* Submit button style */
  .submit-button {
    padding: 12px;
    background-color: #003973;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover {
    background-color: #002851; /* Darker blue on hover */
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    .child {
      width: 90%; /* Adjust form width on smaller screens */
      padding: 20px;
    }
  
    .input-field {
      font-size: 14px;
    }
  }
  .notification {
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  `
})
export class UpdateQuizComponent {
  quizId: any;
  quizForm!: FormGroup;
  message: string = '';
  messageType: string = '';

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizServiceService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.quizId = +(params.get('id') ?? 0);
      if (this.quizId) {
        this.loadQuizData();
      }    });

    // Initialiser le formulaire avec des valeurs vides
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      descrption: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      time: ['', [Validators.required, Validators.min(5), Validators.pattern('^[0-9]+$')]]
    });
  }

  loadQuizData(): void {
    this.quizService.getQuizById(this.quizId).subscribe(quiz => {
              console.log('Données reçues :', quiz); // Debugging

      this.quizForm.patchValue({
        title: quiz.title,
        descrption: quiz.descrption,  // Correction du champ
        time: quiz.time
      });
    });
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.message = 'Veuillez remplir tous les champs requis !';
      this.messageType = 'error';
      return;
    }

    this.adminService.updateQuiz(this.quizId, this.quizForm.value).subscribe({
      next: () => {
        this.message = 'Quiz mis à jour avec succès !';
        this.messageType = 'success';

        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.message = 'Échec de la mise à jour du quiz. Veuillez réessayer.';
        this.messageType = 'error';
      }
    });
  }

}
