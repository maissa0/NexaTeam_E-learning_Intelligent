import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private devicesService: AdminService,
    private router: Router,
  ){}
    QuizForm!: FormGroup;
    ngOnInit(): void {
      this.QuizForm = this.fb.group({
        title: ['', Validators.required],           // Ensure 'title' matches backend
        descrption: ['', Validators.required],     // Ensure 'description' matches backend
        time: ['', Validators.required], // Time should be at least 1 second
      });
    }
  
    onSubmit() {
      if (this.QuizForm.valid) {
        console.log('Submitting quiz:', this.QuizForm.value);
        
        console.log('Quiz data being sent:', this.QuizForm.value);
        this.devicesService.createQuiz(this.QuizForm.value).subscribe(
          (res) => {
            console.log('Test successfully created', res);
            console.log('Response from server:', res);
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error occurred:', error);
            alert('Error: ' + (error.message || 'Unknown error'));
          }
        );
      } else {
        alert('Form is invalid. Please check your inputs.');
      }
    }
    
  

}
