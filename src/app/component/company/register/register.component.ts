import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../../../services/company.service';

interface CompanyRegistrationRequest {
  name: string;
  address: string;
  logo: string;
  emailCompany: string;
  description: string;
}

@Component({
  selector: 'app-company-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ToastModule,
    CardModule,
    ProgressBarModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class CompanyRegisterComponent implements OnInit {
  companyForm!: FormGroup;
  isLoading = false;
  logoPreview: string | null = null;
  logoFile: File | null = null;
  
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private messageService: MessageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      address: [''],
      emailCompany: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      description: ['']
    });
  }

  navigateToCompany(): void {
    this.router.navigate(['/pages/company']);
  }

  onLogoSelect(event: any): void {
    this.logoFile = event.files[0];
    
    if (this.logoFile) {
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.logoFile);
      
      this.messageService.add({
        severity: 'info',
        summary: 'Logo Selected',
        detail: 'Company logo has been selected'
      });
    }
  }

  removeLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
  }

  async onSubmit(): Promise<void> {
    if (this.companyForm.invalid) {
      this.markFormGroupTouched(this.companyForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isLoading = true;
    
    try {
      // Handle the logo
      let logoUrl = '';
      if (this.logoFile) {
        // Use the preview as the logo URL (it's already a base64 string)
        logoUrl = this.logoPreview || '';
      }
      
      // Then submit the company registration
      const companyData: CompanyRegistrationRequest = {
        ...this.companyForm.value,
        logo: logoUrl
      };
      
      this.companyService.registerCompanyPublic(companyData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Company registration submitted successfully. You will be notified via email once it\'s processed.'
          });
          // Navigate to company profile or dashboard
          setTimeout(() => {
            this.router.navigate(['/pages/company']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to register company'
          });
        }
      });
    } catch (error: any) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An unexpected error occurred'
      });
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
} 