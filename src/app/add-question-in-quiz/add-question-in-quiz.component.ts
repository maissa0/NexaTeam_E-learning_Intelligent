import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-add-question-in-quiz',
  templateUrl: './add-question-in-quiz.component.html',

    styleUrls: ['./add-question-in-quiz.component.css']
})
export class AddQuestionInQuizComponent {
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
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required]],
      optionA: ['', [Validators.required]],
      optionB: ['', [Validators.required]],
      optionC: ['', [Validators.required]],
      optionD: ['', [Validators.required]],
      correctOption: ['', [Validators.required]],
      quizId: ['', Validators.required]
    });
    this.id=this.activatedRoute.snapshot.params["id"];
  }
  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Submitting question:', this.questionForm.value);
      
      console.log('Question data being sent:', this.questionForm.value);
      this.devicesService.addQuestionInQuiz(this.questionForm.value).subscribe(
        (res: any) => {
          console.log('Question successfully added', res);
          console.log('Response from server:', res);
          
          // Set success message
          this.message = 'Question added successfully!';
          this.messageType = 'success';
  
          // Redirect after a short delay (optional)
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          console.error('Error occurred:', error);
          
          // Set error message
          this.message = 'Error adding question. Please try again!';
          this.messageType = 'error';
        }
      );
    } else {
      // Form is invalid, show error message
      this.message = 'Form is invalid. Please check your inputs.';
      this.messageType = 'error';
    }
  }
  
  
  }
  
