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
