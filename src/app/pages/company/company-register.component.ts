import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../../services/company.service';
import { CompanyRegistrationRequest, RequestStatus } from '../../models/company.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CardModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <h2>Register Your Company</h2>
      <p class="text-secondary mb-4">
        Fill out the form below to register your company. Your request will be reviewed by an administrator.
      </p>

      <p-toast></p-toast>

      <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
        <div class="grid">
          <div class="col-12 md:col-8">
            <p-card>
              <div class="field">
                <label for="name" class="font-bold">Company Name*</label>
                <input id="name" type="text" pInputText class="w-full" formControlName="name" />
                <small *ngIf="companyForm.get('name')?.invalid && companyForm.get('name')?.touched" class="p-error">
                  Company name is required
                </small>
              </div>

              <div class="field">
                <label for="emailCompany" class="font-bold">Company Email*</label>
                <input id="emailCompany" type="text" pInputText class="w-full" formControlName="emailCompany" />
                <small *ngIf="companyForm.get('emailCompany')?.invalid && companyForm.get('emailCompany')?.touched" class="p-error">
                  Valid company email is required
                </small>
              </div>

              <div class="field">
                <label for="address" class="font-bold">Address</label>
                <input id="address" type="text" pInputText class="w-full" formControlName="address" />
              </div>

              <div class="field">
                <label for="description" class="font-bold">Description</label>
                <textarea id="description" pInputTextarea [rows]="5" class="w-full" formControlName="description"></textarea>
              </div>
            </p-card>
          </div>

          <div class="col-12 md:col-4">
            <p-card>
              <h3>Company Logo</h3>
              <div class="flex flex-column align-items-center">
                <img [src]="logoPreview || 'assets/layout/images/company-placeholder.png'" 
                     alt="Company Logo" 
                     class="w-10rem h-10rem mb-3 border-1 border-round" />
                
                <p-fileUpload mode="basic" chooseLabel="Upload Logo" 
                              name="logo" [url]="''" [auto]="false" 
                              accept="image/*" [maxFileSize]="1000000"
                              (onSelect)="onLogoSelect($event)"
                              styleClass="w-full"></p-fileUpload>
                
                <small class="text-secondary mt-2">
                  Recommended size: 200x200 pixels. Max file size: 1MB.
                </small>
              </div>
            </p-card>

            <div class="flex justify-content-end mt-4">
              <button pButton type="button" label="Cancel" class="p-button-outlined p-button-secondary mr-2" (click)="onCancel()"></button>
              <button pButton type="submit" label="Submit Request" [disabled]="companyForm.invalid || isLoading"></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      emailCompany: ['', [Validators.required, Validators.email]],
      address: [''],
      description: ['']
    });
  }

  onLogoSelect(event: any): void {
    this.logoFile = event.files[0];
    
    // Create a preview of the selected image
    if (this.logoFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Create FormData object to send both form data and file
    const formData = new FormData();
    
    // Add form fields
    const companyData: CompanyRegistrationRequest = {
      name: this.companyForm.get('name')?.value,
      emailCompany: this.companyForm.get('emailCompany')?.value,
      address: this.companyForm.get('address')?.value,
      description: this.companyForm.get('description')?.value,
      status: RequestStatus.PENDING
    };
    
    // Add JSON data
    formData.append('companyData', new Blob([JSON.stringify(companyData)], {
      type: 'application/json'
    }));
    
    // Add logo file if selected
    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

    this.companyService.registerCompany(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Request Submitted',
          detail: 'Your company registration request has been submitted successfully and is pending approval.'
        });
        
        // Reset form
        this.companyForm.reset();
        this.logoPreview = null;
        this.logoFile = null;
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to submit company registration request. Please try again.'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
} 