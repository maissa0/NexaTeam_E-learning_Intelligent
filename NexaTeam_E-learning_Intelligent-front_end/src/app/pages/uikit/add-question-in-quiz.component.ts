import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../service/admin-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-add-question-in-quiz',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  template: ` <div class="container">
  <div class="form-container">
    <h2>Add Question</h2>
    <div *ngIf="message" class="alert" [ngClass]="messageType === 'success' ? 'alert-success' : 'alert-danger'">
      {{ message }}
    </div>
    <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="questionText">Question</label>
        <textarea id="questionText" formControlName="questionText" placeholder="Enter the question" required></textarea>
      </div>

      <div class="form-group">
        <label for="optionA">Option A</label>
        <input type="text" id="optionA" formControlName="optionA" placeholder="Option A" required>
      </div>

      <div class="form-group">
        <label for="optionB">Option B</label>
        <input type="text" id="optionB" formControlName="optionB" placeholder="Option B" required>
      </div>

      <div class="form-group">
        <label for="optionC">Option C</label>
        <input type="text" id="optionC" formControlName="optionC" placeholder="Option C" required>
      </div>

      <div class="form-group">
        <label for="optionD">Option D</label>
        <input type="text" id="optionD" formControlName="optionD" placeholder="Option D" required>
      </div>

      <div class="form-group">
        <label for="correctOption">Correct Option</label>
        <select id="correctOption" formControlName="correctOption" required>
          <option value="">Select the correct option</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
      </div>
      <input type="hidden" formControlName="quizId">


      <button type="submit" [disabled]="!questionForm.valid" class="submit-btn">Submit Question</button>
    </form>
  </div>
</div>`,
  styles: `/* Form Group */
  .form-group {
    margin-bottom: 18px;
    text-align: left;
  }
  
  label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    display: block;
    font-weight: 600;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-top: 6px;
  }
  
  textarea {
    resize: vertical;
    height: 120px;  /* Fixed height for textarea */
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: #4CAF50;
    outline: none;
  }
  
  /* Button */
  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 15px;
    }
  
    h2 {
      font-size: 20px;
    }
  
    button {
      font-size: 15px;
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
  }`
})
export class AddQuestionInQuizComponent  implements OnInit {
  message:string='';
  messageType:string='';
  constructor(
    private fb: FormBuilder,
    private devicesService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  id: number | null = null;
  questionForm!: FormGroup;

  ngOnInit(){
    this.id=this.activatedRoute.snapshot.params["id"];
    console.log('Quiz ID:', this.id);

    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required]],
      optionA: ['', [Validators.required]],
      optionB: ['', [Validators.required]],
      optionC: ['', [Validators.required]],
      optionD: ['', [Validators.required]],
      correctOption: ['', [Validators.required]],
      
  
    });
  }
  onSubmit() {
    if (this.questionForm.valid && this.id) {
      // Add the quiz ID before submission
      const formData = {
        ...this.questionForm.value,
        quizId: this.id,  // Attach the quiz ID
      };

      console.log('Submitting question:', formData);

      this.devicesService.addQuestionInQuiz(formData).subscribe(
        (res: any) => {
          console.log('Question successfully added', res);

          this.message = 'Question added successfully!';
          this.messageType = 'success';

          // Redirect after a short delay
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          console.error('Error occurred:', error);
          this.message = 'Error adding question. Please try again!';
          this.messageType = 'error';
        }
      );
    } else {
      this.message = 'Form is invalid. Please check your inputs.';
      this.messageType = 'error';
    }
  }
  
  

}
