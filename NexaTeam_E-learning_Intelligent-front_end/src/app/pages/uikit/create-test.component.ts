import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../service/admin-service.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-create-test',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  template: `
  <div class="bg">
  <div class="parent">
    <div class="child">
      <form [formGroup]="QuizForm" class="login-form" (ngSubmit)="onSubmit()">
        <div *ngIf="message" class="notification" [ngClass]="messageType">
          {{ message }}
        </div>
        
       <!-- Title field -->
<div class="form-item">
  <label for="title" class="form-label">Title</label>
  <div class="form-control">
    <input type="text" id="title" formControlName="title" 
      placeholder="Enter the title" 
      class="input-field" 
    />
    <div *ngIf="QuizForm.get('title')?.invalid && QuizForm.get('title')?.touched" class="error-message">
      <span *ngIf="QuizForm.get('title')?.errors?.['required']">Title is required.</span>
      <span *ngIf="QuizForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters.</span>
      <span *ngIf="QuizForm.get('title')?.errors?.['pattern']">Title cannot be only spaces.</span>    </div>
  </div>
</div>

<!-- Description field -->
<div class="form-item">
  <label for="descrption" class="form-label">descrption </label>
  <div class="form-control">
    <textarea 
      id="descrption" 
      formControlName="descrption" 
      placeholder="Describe the quiz..." 
      class="input-field descrption -field" 
      rows="5"
    ></textarea>
    <div *ngIf="QuizForm.get('descrption')?.invalid && QuizForm.get('descrption')?.touched" class="error-message">
      <span *ngIf="QuizForm.get('descrption')?.errors?.['required']">Description is required.</span>
      <span *ngIf="QuizForm.get('descrption')?.errors?.['minlength']">Description must be at least 10 characters.</span>    </div>
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
      placeholder="Enter time in seconds" 
      class="input-field" 
    />
    <div *ngIf="QuizForm.get('time')?.invalid && QuizForm.get('time')?.touched" class="error-message">
      <span *ngIf="QuizForm.get('time')?.errors?.['required']">Time is required.</span>
      <span *ngIf="QuizForm.get('time')?.errors?.['pattern']">Enter a valid number.</span>    </div>
  </div>
</div>
    
        <!-- Submit button -->
        <div class="form-item">
          <button type="submit" [disabled]="QuizForm.invalid" class="submit-button">Submit</button>
        </div>
    
      </form>
    </div>
  </div>
</div>

  `,
  styles: [`
    .bg {
      background-color: #f4f4f4;
      padding: 20px;
    }
    .parent {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .child {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }
    .form-item {
      margin-bottom: 16px;
    }
    .form-label {
      font-weight: bold;
      margin-bottom: 8px;
      display: block;
    }
    .form-control {
      margin-bottom: 8px;
    }
    .input-field {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .error-message {
      color: red;
      font-size: 12px;
    }
    .submit-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }
    .submit-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .success {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.error {
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

  `],
  providers:[]

})
export class CreateTestComponent  implements OnInit {
  message:string='';
  messageType:string='';
  constructor(private fb: FormBuilder,
    private devicesService: AdminService,
    private router: Router,
  ){}
    QuizForm!: FormGroup;
    ngOnInit(): void {
      this.QuizForm = this.fb.group({
        title: ['', [
          Validators.required, 
          Validators.minLength(3)  // Ensure 'title' has a minimum length of 3 characters
        ]], 
      
        descrption: ['', [
          Validators.required, 
          Validators.minLength(10)  // Ensure 'description' has a minimum length of 10 characters
        ]],
      
        time: ['', [
          Validators.required, 
          Validators.pattern('^[0-9]+$'),
          Validators.min(1)  // Ensure time is a valid number
        ]]
      });
      
    }
  
    onSubmit() {
      if (this.QuizForm.valid) {
        let formData = this.QuizForm.value;
        formData.time = Number(formData.time);  // Ensure time is a number
    
        console.log('Submitting quiz:', formData);
    
        this.devicesService.createQuiz(formData).subscribe({
          next: (res) => {
            console.log('Quiz successfully created:', res);
            this.message = 'Quiz created successfully!';
            this.messageType = 'success';
    
            setTimeout(() => this.router.navigate(['/']), 2000);
          },
          error: (error) => {
            console.error('Error occurred:', error);
            this.message = 'Failed to create quiz. Please try again.';
            this.messageType = 'error';
          }
        });
    
      } else {
        this.message = 'Form is invalid. Please check your inputs.';
        this.messageType = 'error';
      }
    }

}
