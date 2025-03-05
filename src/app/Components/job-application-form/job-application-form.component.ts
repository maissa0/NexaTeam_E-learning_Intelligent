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

  private loadApplicationData() {
    if (this.applicationId) {
      this.jobApplicationService.getJobApplicationById(this.applicationId).subscribe({
        next: (application) => {
          if (application) {
            this.populateForm(application);
          } else {
            this.errorMessage = 'Candidature non trouvée.';
          }
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement de la candidature.';
        }
      });
    }
  }

  private populateForm(application: JobApplication) {
    this.applicationForm.patchValue({
      name: application.name,
      email: application.email,
      telephone: application.telephone,
      status: application.status,
      submissionDate: new Date(application.submissionDate),
      resume: application.resumeUrl, // Add resume URL
      coverLetter: application.coverLetterUrl // Add cover letter URL
    });
  }

  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        if (field === 'resume') {
          this.resumeFile = file;
          this.applicationForm.patchValue({ 
            resume: file.name,
            resumeUrl: URL.createObjectURL(file) // Create temporary URL for preview
          });
        } else if (field === 'coverLetter') {
          this.coverLetterFile = file;
          this.applicationForm.patchValue({ 
            coverLetter: file.name,
            coverLetterUrl: URL.createObjectURL(file)
          });
        }
      } else {
        // ... error handling
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  }

  private uploadFiles() {
    const uploadResume = this.resumeFile ? this.jobApplicationService.uploadFile(this.resumeFile) : of(null);
    const uploadCoverLetter = this.coverLetterFile ? this.jobApplicationService.uploadFile(this.coverLetterFile) : of(null);

    return forkJoin([uploadResume, uploadCoverLetter]);
  }

  private submitApplication(resumeUrl: string, coverLetterUrl?: string) {
    const jobApplication: JobApplication = {
      ...(this.applicationId && { idjobApp: this.applicationId }),
      name: this.applicationForm.get('name')?.value,
      email: this.applicationForm.get('email')?.value,
      telephone: this.applicationForm.get('telephone')?.value,
      resumeUrl: resumeUrl || this.applicationForm.get('resume')?.value, // Use existing URL if no new file
      coverLetterUrl: coverLetterUrl || this.applicationForm.get('coverLetter')?.value,
      status: this.applicationForm.get('status')?.value || 'PENDING',
      submissionDate: new Date().toISOString()
    };

    const request$ = this.isEditing
      ? this.jobApplicationService.updateJobApplication(this.applicationId!, jobApplication)
      : this.jobApplicationService.submitApplication(jobApplication);

    return request$;
  }

  onSubmit(): void {
    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.uploadFiles()
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.isLoading = false;
          })
        )
        .subscribe({
          next: ([resumeResponse, coverLetterResponse]) => {
            const resumeUrl = resumeResponse?.fileUrl || '';
            const coverLetterUrl = coverLetterResponse?.fileUrl;

            this.submitApplication(resumeUrl, coverLetterUrl).subscribe({
              next: () => {
                this.successMessage = this.isEditing ? 'Candidature mise à jour avec succès !' : 'Candidature soumise avec succès !';
                setTimeout(() => {
                  this.router.navigate(['/application']);
                }, 2000);
              },
              error: (error) => {
                this.errorMessage = error.error?.message || 'Échec de la soumission de la candidature. Veuillez réessayer.';
              }
            });
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors du téléchargement des fichiers. Veuillez réessayer.';
          }
        });
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
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