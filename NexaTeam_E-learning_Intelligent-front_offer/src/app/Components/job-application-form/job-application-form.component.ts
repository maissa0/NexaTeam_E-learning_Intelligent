import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobApplicationService } from '../../Services/job-application.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

interface JobApplication {
  idjobApp?: string;
  name: string;
  email: string;
  telephone: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  status: string;
  submissionDate: string;
}

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
  isLoading = false;
  resumeFile: File | null = null;
  coverLetterFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isEditing = false;
  applicationId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private jobApplicationService: JobApplicationService,
    private router: Router,
    private route: ActivatedRoute
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
      submissionDate: [new Date()]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.applicationId = params['id'];
        this.isEditing = true;
        this.loadApplicationData();
      }
    });
  }

  private loadApplicationData(): void {
    if (!this.applicationId) return;
    
    this.isLoading = true;
    this.jobApplicationService.getJobApplicationById(this.applicationId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (application) => {
          this.populateForm(application);
        },
        error: (error) => {
          this.errorMessage = 'Failed to load application data';
          console.error('Error loading application:', error);
        }
      });
  }

  private populateForm(application: any): void {
    this.applicationForm.patchValue({
      name: application.name,
      email: application.email,
      telephone: application.telephone,
      status: application.status,
      submissionDate: new Date(application.submissionDate),
      resume: application.resumeUrl,
      coverLetter: application.coverLetterUrl
    });
  }

  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        if (field === 'resume') {
          this.resumeFile = file;
          this.applicationForm.patchValue({ resume: file });
        } else if (field === 'coverLetter') {
          this.coverLetterFile = file;
          this.applicationForm.patchValue({ coverLetter: file });
        }
      } else {
        this.errorMessage = 'Please upload a valid PDF or Word document';
        input.value = '';
      }
    }
  }

  removeFile(field: string): void {
    if (field === 'resume') {
      this.resumeFile = null;
      this.applicationForm.patchValue({ resume: null });
      const input = document.getElementById('resume') as HTMLInputElement;
      if (input) input.value = '';
    } else if (field === 'coverLetter') {
      this.coverLetterFile = null;
      this.applicationForm.patchValue({ coverLetter: null });
      const input = document.getElementById('coverLetter') as HTMLInputElement;
      if (input) input.value = '';
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  }

  onSubmit(): void {
    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const uploadFiles = () => {
        const uploadResume = this.resumeFile ? this.jobApplicationService.uploadFile(this.resumeFile) : of(null);
        const uploadCoverLetter = this.coverLetterFile ? this.jobApplicationService.uploadFile(this.coverLetterFile) : of(null);
        return forkJoin([uploadResume, uploadCoverLetter]);
      };

      uploadFiles()
        .pipe(finalize(() => {
          this.isSubmitting = false;
          this.isLoading = false;
        }))
        .subscribe({
          next: ([resumeResponse, coverLetterResponse]) => {
            const formData = {
              ...this.applicationForm.value,
              resumeUrl: resumeResponse?.fileUrl || this.applicationForm.get('resume')?.value,
              coverLetterUrl: coverLetterResponse?.fileUrl || this.applicationForm.get('coverLetter')?.value
            };

            const request$ = this.isEditing
              ? this.jobApplicationService.updateJobApplication(this.applicationId!, formData)
              : this.jobApplicationService.submitApplication(formData);

            request$.subscribe({
              next: () => {
                this.successMessage = this.isEditing
                  ? 'Application updated successfully!'
                  : 'Application submitted successfully!';
                setTimeout(() => {
                  this.router.navigate(['/applications']);
                }, 2000);
              },
              error: (error) => {
                this.errorMessage = error.message || 'Failed to submit application. Please try again.';
              }
            });
          },
          error: (error) => {
            this.errorMessage = 'Error uploading files. Please try again.';
          }
        });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  resetForm(): void {
    this.applicationForm.reset({
      status: 'PENDING',
      submissionDate: new Date()
    });
    this.resumeFile = null;
    this.coverLetterFile = null;
    this.errorMessage = '';
    this.successMessage = '';
    const resumeInput = document.getElementById('resume') as HTMLInputElement;
    const coverLetterInput = document.getElementById('coverLetter') as HTMLInputElement;
    if (resumeInput) resumeInput.value = '';
    if (coverLetterInput) coverLetterInput.value = '';
  }
}