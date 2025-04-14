import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CertificateService } from '../../services/certificate.service';
import { ResumeService, Resume } from '../../services/resume.service';
import { User, UserUpdateDTO } from '../../models/user.model';
import { CertResponse } from '../../models/certificate.model';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    TabViewModule,
    FileUploadModule,
    CardModule,
    InputSwitchModule,
    DialogModule,
    TooltipModule,
    DividerModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  
  userProfile: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isLoading = false;
  profilePictureUrl: string | null = null;
  isTwoFactorEnabled = false;
  qrCodeUrl: string | null = null;
  verificationCode: string = '';
  showTwoFactorDialog = false;
  showCertificateDialog = false;
  certificates: CertResponse[] = [];
  certificateSource: string = '';
  certificateName: string = '';
  selectedCertificateFile: File | null = null;
  activeTab: string = 'profile'; // Default active tab

  // Resume properties
  resumes: Resume[] = [];
  displayResumeDialog: boolean = false;
  selectedResume: Resume | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private certificateService: CertificateService,
    private resumeService: ResumeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
    this.loadCertificates();
    this.check2FAStatus();
    this.loadResumes();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response.user;
        if (this.userProfile) {
          this.profileForm.patchValue({
            username: this.userProfile.userName || '',
            email: this.userProfile.email || '',
            firstName: this.userProfile.firstName || '',
            lastName: this.userProfile.lastName || ''
          });

          if (this.userProfile.profilePicture) {
            this.profilePictureUrl = this.profileService.getProfilePictureUrl();
          }
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile information'
        });
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updateData: UserUpdateDTO = {
      email: this.profileForm.get('email')?.value,
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
        });
        this.profileForm.markAsPristine();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update profile'
        });
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully'
        });
        this.passwordForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to change password'
        });
      }
    });
  }

  onUploadProfilePicture(event: any): void {
    const file = event.files[0];
    if (!file) {
      return;
    }

    this.isLoading = true;
    this.profileService.uploadProfilePicture(file).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile picture uploaded successfully'
        });
        // Refresh profile picture
        this.profilePictureUrl = this.profileService.getProfilePictureUrl() + '?t=' + new Date().getTime();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to upload profile picture'
        });
      }
    });
  }

  onDeleteProfilePicture(): void {
    this.isLoading = true;
    this.profileService.deleteProfilePicture().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.profilePictureUrl = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile picture removed successfully'
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to remove profile picture'
        });
      }
    });
  }

  // Method to handle file upload from the direct file input in the template
  updatePicture(file: File): void {
    if (!file) {
      return;
    }
    
    this.isLoading = true;
    this.authService.uploadProfilePicture(file).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile picture uploaded successfully'
        });
        
        // Refresh profile picture with a cache-busting parameter
        this.profilePictureUrl = this.profileService.getProfilePictureUrl();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to upload profile picture'
        });
      }
    });
  }

  check2FAStatus(): void {
    this.authService.get2FAStatus().subscribe({
      next: (response) => {
        this.isTwoFactorEnabled = response.is2faEnabled;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get 2FA status'
        });
      }
    });
  }

  onToggleTwoFactor(): void {
    this.showTwoFactorDialog = true;
  }

  confirmToggleTwoFactor(): void {
    this.showTwoFactorDialog = false;
    this.isLoading = true;

    if (this.isTwoFactorEnabled) {
      // Enable 2FA
      this.authService.enable2FA().subscribe({
        next: (response) => {
          this.qrCodeUrl = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.isTwoFactorEnabled = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to enable 2FA'
          });
        }
      });
    } else {
      // Disable 2FA
      this.authService.disable2FA().subscribe({
        next: (response) => {
          this.isLoading = false;
          this.qrCodeUrl = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: '2FA disabled successfully'
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.isTwoFactorEnabled = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to disable 2FA'
          });
        }
      });
    }
  }

  onVerifyTwoFactor(): void {
    if (!this.verificationCode) {
      return;
    }

    this.isLoading = true;
    this.authService.verify2FASetup(parseInt(this.verificationCode)).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.qrCodeUrl = null;
        this.verificationCode = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: '2FA enabled successfully'
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Invalid verification code'
        });
      }
    });
  }

  loadCertificates(): void {
    this.certificateService.getUserCertificates().subscribe({
      next: (response) => {
        this.certificates = response;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load certificates'
        });
      }
    });
  }

  showAddCertificateDialog(): void {
    this.certificateSource = '';
    this.certificateName = '';
    this.selectedCertificateFile = null;
    this.showCertificateDialog = true;
  }

  onUploadCertificate(event: any): void {
    const file = event.files[0];
    if (!file) {
      return;
    }
    
    // Store the file for later upload
    this.selectedCertificateFile = file;
    
    // Generate a default name from the file name
    const defaultName = file.name.split('.')[0] || 'Certificate';
    
    // Always show the dialog to get proper certificate details
    this.certificateName = defaultName;
    if (!this.certificateSource) {
      this.certificateSource = 'Other'; // Default value
    }
    this.showCertificateDialog = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'File Selected',
      detail: 'Please provide certificate details before uploading'
    });
  }
  
  uploadFromDialog(): void {
    // Debug log
    console.log('Upload from dialog triggered');
    console.log('Current state:', {
      file: this.selectedCertificateFile ? this.selectedCertificateFile.name : 'none',
      source: this.certificateSource,
      name: this.certificateName
    });
    
    try {
      // Validate file
      if (!this.selectedCertificateFile) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select a certificate file'
        });
        return;
      }

      // Validate source
      const trimmedSource = this.certificateSource ? this.certificateSource.trim() : '';
      if (!trimmedSource) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please provide the certificate source'
        });
        return;
      }

      // Validate name
      const trimmedName = this.certificateName ? this.certificateName.trim() : '';
      if (!trimmedName) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please provide a name for the certificate'
        });
        return;
      }
      
      console.log('All validations passed, proceeding with upload');
      this.isLoading = true;
      
      // Create a copy of the file to ensure we're using the same reference
      const fileToUpload = this.selectedCertificateFile;
      
      // Call the certificate service directly
      this.certificateService.uploadCertificate(fileToUpload, trimmedSource, trimmedName)
        .subscribe({
          next: (response) => {
            console.log('Certificate upload successful:', response);
            this.isLoading = false;
            this.certificateSource = '';
            this.certificateName = '';
            this.selectedCertificateFile = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Certificate uploaded successfully'
            });
            this.loadCertificates();
            this.showCertificateDialog = false;
          },
          error: (error) => {
            console.error('Certificate upload error details:', error);
            this.isLoading = false;
            
            // Check if this is a fraud detection alert
            if (error.error && error.error.message && error.error.message.includes('FRAUD ALERT')) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Certificate Verification Failed',
                detail: error.error.message,
                sticky: true
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error?.message || 'Failed to upload certificate'
              });
            }
          }
        });
    } catch (err) {
      console.error('Error during upload preparation:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred preparing the upload'
      });
      this.isLoading = false;
    }
  }

  onDownloadCertificate(cert: CertResponse): void {
    window.open(cert.downloadURL, '_blank');
  }

  onDeleteCertificate(cert: CertResponse): void {
    const certId = cert.downloadURL.split('/').pop();
    if (!certId) {
      return;
    }

    this.isLoading = true;
    this.certificateService.deleteCertificate(certId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Certificate deleted successfully'
        });
        this.loadCertificates();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete certificate'
        });
      }
    });
  }

  // Resume methods
  loadResumes() {
    this.isLoading = true;
    this.resumeService.getMyResumes().subscribe({
      next: (resumes) => {
        this.resumes = resumes;
        console.log('Loaded resumes:', resumes);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching resumes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load resumes'
        });
      }
    });
  }
  
  viewResume(resume: Resume) {
    this.selectedResume = resume;
    this.displayResumeDialog = true;
  }
  
  handleDownloadClick() {
    if (this.selectedResume && this.selectedResume.id) {
      this.generatePDF(this.selectedResume.id);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot generate PDF - Resume ID is missing'
      });
    }
  }
  
  downloadResume(resume: Resume) {
    if (!resume) return;
    
    try {
      // Create a simple HTML representation of the resume
      const resumeHtml = this.generateResumeHtml(resume);
      
      // Create a Blob from the HTML
      const blob = new Blob([resumeHtml], { type: 'text/html' });
      
      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${resume.name}_Resume.html`;
      
      // Append the link to the body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download resume'
      });
    }
  }
  
  generateResumeHtml(resume: Resume): string {
    // Create a simple HTML representation of the resume
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resume.name} - Resume</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 0;
            background-color: #dcdcdc; 
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .card {
            background-color: white;
            padding: 20px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .header { text-align: center; }
          h1 { 
            margin-bottom: 5px; 
            font-size: 22px;
          }
          h2 { 
            color: #333; 
            font-weight: normal; 
            margin-top: 5px; 
            font-size: 16px;
          }
          .contact { 
            margin-top: 10px; 
            color: #555;
          }
          .section-title { 
            color: #464646; 
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .divider {
            height: 1px;
            background-color: #969696;
            margin-bottom: 15px;
          }
          .job-header, .edu-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 5px; 
          }
          .job-title, .degree-title { 
            font-weight: bold; 
            margin: 0;
            font-size: 14px;
          }
          .company-name, .institution-name { 
            color: #666; 
            margin-top: 0;
            margin-bottom: 5px;
            font-style: italic;
            font-size: 12px;
          }
          .dates { 
            color: #666; 
            font-size: 0.9em; 
          }
          .description {
            font-size: 12px;
            margin-bottom: 15px;
          }
          .skill-item { 
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .skill-name { 
            font-weight: bold; 
            font-size: 12px;
          }
          .skill-level { 
            color: #666; 
            font-size: 12px;
          }
          .separator {
            height: 1px;
            background-color: #f0f0f0;
            margin: 10px 0;
          }
          .address {
            font-size: 12px;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Section -->
          <div class="card">
            <div class="header">
              <h1>${resume.name}</h1>
              <h2>${resume.job || 'Professional'}</h2>
              ${resume.address ? `<div class="address">${resume.address}</div>` : ''}
              <div class="contact">
                ${resume.phone ? `${resume.phone}` : ''}
                ${resume.phone && resume.email ? ' &nbsp;&nbsp; ' : ''}
                ${resume.email ? `${resume.email}` : ''}
              </div>
            </div>
          </div>
          
          <!-- Summary Section -->
          ${resume.summary ? `
          <div class="card">
            <div class="section-title">Summary</div>
            <div class="divider"></div>
            <div class="description">${resume.summary}</div>
          </div>
          ` : ''}
          
          <!-- Experience Section -->
          ${resume.experience && resume.experience.length > 0 ? `
          <div class="card">
            <div class="section-title">Experience</div>
            <div class="divider"></div>
            ${resume.experience.map((exp, index) => `
              <div class="experience-item">
                <div class="job-header">
                  <div class="job-title">${exp.title || ''}</div>
                  <div class="dates">
                    ${exp.startDate || ''} ${exp.endDate ? '- ' + exp.endDate : exp.startDate ? '- Present' : ''}
                  </div>
                </div>
                <div class="company-name">${exp.company || ''}${exp.address ? ' - ' + exp.address : ''}</div>
                <div class="description">${exp.summary || ''}</div>
                ${index < resume.experience.length - 1 ? '<div class="separator"></div>' : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <!-- Education Section -->
          ${resume.education && resume.education.length > 0 ? `
          <div class="card">
            <div class="section-title">Education</div>
            <div class="divider"></div>
            ${resume.education.map((edu, index) => `
              <div class="education-item">
                <div class="edu-header">
                  <div class="job-title">${edu.name || ''}</div>
                  <div class="dates">${edu.year || ''}</div>
                </div>
                ${edu.qualification ? `<div class="company-name">${edu.qualification}</div>` : ''}
                ${edu.address ? `<div class="description">${edu.address}</div>` : ''}
                ${index < resume.education.length - 1 ? '<div class="separator"></div>' : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <!-- Skills Section -->
          ${resume.skills && resume.skills.length > 0 ? `
          <div class="card">
            <div class="section-title">Skills</div>
            <div class="divider"></div>
            ${resume.skills.map(skill => `
              <div class="skill-item">
                <div class="skill-name">${skill.name || ''}</div>
                <div class="skill-level">${skill.level || ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }
  
  deleteResume(id?: number) {
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Resume ID is required to delete resume'
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this resume?')) {
      this.isLoading = true;
      this.resumeService.deleteResume(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadResumes(); // Reload the resumes
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Resume deleted successfully'
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error deleting resume:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete resume'
          });
        }
      });
    }
  }
  
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  }

  // Add this method to handle PDF download
  generatePDF(id?: number) {
    if (!id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Resume ID is required to generate PDF'
      });
      return;
    }
    
    this.isLoading = true;
    this.resumeService.generatePDF(id).subscribe({
      next: (blob: Blob) => {
        this.isLoading = false;
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create an anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${id}.pdf`;
        // Click the anchor
        document.body.appendChild(a);
        a.click();
        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generating PDF:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate PDF'
        });
      }
    });
  }

  // Test direct upload using native XMLHttpRequest
  testDirectUpload(): void {
    if (!this.selectedCertificateFile || !this.certificateSource) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File and source are required'
      });
      return;
    }

    console.log('Testing direct upload');
    this.isLoading = true;

    // Create direct form data
    const formData = new FormData();
    formData.append('fromWhere', this.certificateSource);
    if (this.certificateName) {
      formData.append('name', this.certificateName);
    }
    formData.append('file', this.selectedCertificateFile);

    // Use XMLHttpRequest for direct testing
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${environment.apiUrl}/api/certs/upload`, true);
    
    // Add token
    const token = this.authService.getToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Track progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        console.log(`Upload progress: ${percentComplete}%`);
      }
    };

    // Set response handlers
    xhr.onload = () => {
      this.isLoading = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Upload successful!', xhr.responseText);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Certificate uploaded successfully (direct method)'
        });
        this.loadCertificates();
        this.showCertificateDialog = false;
      } else {
        console.error('Upload failed', xhr.status, xhr.responseText);
        try {
          const errorObj = JSON.parse(xhr.responseText);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorObj.message || 'Upload failed'
          });
        } catch (e) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Upload failed with status ${xhr.status}`
          });
        }
      }
    };

    xhr.onerror = () => {
      this.isLoading = false;
      console.error('Network error during upload');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Network error during upload'
      });
    };

    // Send the request
    xhr.send(formData);
    console.log('XHR request sent');
  }
}