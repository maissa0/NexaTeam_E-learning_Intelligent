import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationService } from '../../Services/job-application.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class JobApplicationFormComponent implements OnInit {
applicationForm!: FormGroup;
  isSubmitting = false;
  resumeFile: File | null = null;
  coverLetterFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private jobApplicationService: JobApplicationService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.applicationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      resume: [null, Validators.required],
      coverLetter: [null],
      status: ['PENDING'],
      submissionDate: [new Date()]  // Add this line
    });
  }

  ngOnInit(): void {}

  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        if (field === 'resume') {
          this.resumeFile = file;
          this.applicationForm.patchValue({ resume: file.name });
        } else if (field === 'coverLetter') {
          this.coverLetterFile = file;
          this.applicationForm.patchValue({ coverLetter: file.name });
        }
      } else {
        this.errorMessage = 'Please upload only PDF, DOC, or DOCX files.';
        input.value = '';
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  }
  onSubmit(): void {
      if (this.applicationForm.valid && !this.isSubmitting) {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';
  
        const formData = new FormData();
        
        // Add text fields
        formData.append('name', this.applicationForm.get('name')?.value);
        formData.append('email', this.applicationForm.get('email')?.value);
        formData.append('telephone', this.applicationForm.get('telephone')?.value);
        formData.append('status', 'PENDING');
        formData.append('submissionDate', new Date().toISOString());  // Add this line
  
        // Add files with specific names
        if (this.resumeFile) {
          formData.append('resume', this.resumeFile, this.resumeFile.name);
        }
        if (this.coverLetterFile) {
          formData.append('coverLetter', this.coverLetterFile, this.coverLetterFile.name);
        }
  
        this.jobApplicationService.submitApplication(formData).subscribe({
          next: (response) => {
            this.successMessage = 'Application submitted successfully!';
            setTimeout(() => {
              this.router.navigate(['/applications']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to submit application. Please try again.';
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        this.errorMessage = 'Please fill all required fields correctly.';
      }
    }
  resetForm(): void {
    this.applicationForm.reset();
    this.resumeFile = null;
    this.coverLetterFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}