import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AiService } from '../../services/ai.service';

interface Experience {
  id?: number;
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  description: string;
  current?: boolean;
}

@Component({
  selector: 'app-resume-experience',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    CalendarModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="experience-container">
      <div class="p-fluid">
        <div class="p-field mb-3">
          <label for="job-title" class="block mb-2">Job Title</label>
          <input id="job-title" type="text" pInputText [(ngModel)]="experience.jobTitle" 
                placeholder="e.g. Software Developer">
        </div>
        
        <div class="p-field mb-3">
          <label for="company" class="block mb-2">Company</label>
          <input id="company" type="text" pInputText [(ngModel)]="experience.company"
                placeholder="e.g. ABC Corporation">
        </div>
        
        <div class="p-field mb-3">
          <label for="location" class="block mb-2">Location</label>
          <input id="location" type="text" pInputText [(ngModel)]="experience.location"
                placeholder="e.g. New York, NY">
        </div>
        
        <div class="grid">
          <div class="col-6 p-field mb-3">
            <label for="start-date" class="block mb-2">Start Date</label>
            <p-calendar id="start-date" [(ngModel)]="experience.startDate" 
                      [showIcon]="true" dateFormat="mm/yy" view="month"></p-calendar>
          </div>
          
          <div class="col-6 p-field mb-3">
            <label for="end-date" class="block mb-2">End Date</label>
            <p-calendar id="end-date" [(ngModel)]="experience.endDate" 
                      [showIcon]="true" dateFormat="mm/yy" view="month" 
                      [disabled]="experience.current || false"></p-calendar>
            <div class="mt-2">
              <input type="checkbox" id="current-job" [(ngModel)]="experience.current">
              <label for="current-job" class="ml-2">Current Job</label>
            </div>
          </div>
        </div>
        
        <div class="p-field mb-3">
          <div class="flex justify-content-between align-items-center mb-2">
            <label for="description" class="block">Description</label>
            <button pButton pRipple type="button" label="Generate with AI" 
                  icon="pi pi-bolt" class="p-button-sm p-button-outlined" 
                  [disabled]="!canGenerateDescription()"
                  (click)="generateDescription()"></button>
          </div>
          <textarea id="description" pInputTextarea [(ngModel)]="experience.description" 
                  rows="5" placeholder="Describe your responsibilities and achievements..."></textarea>
        </div>
        
        <div class="flex justify-content-end gap-2 mt-3">
          <button pButton pRipple type="button" label="Cancel"
                class="p-button-outlined p-button-secondary"
                (click)="cancel()"></button>
          <button pButton pRipple type="button" label="Save" 
                [disabled]="!isExperienceValid()"
                (click)="save()"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .experience-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    :host ::ng-deep .p-calendar {
      width: 100%;
    }
  `]
})
export class ResumeExperienceComponent implements OnInit {
  @Input() experienceData: Experience | null = null;
  @Output() saved = new EventEmitter<Experience>();
  @Output() cancelled = new EventEmitter<void>();
  
  experience: Experience = this.getEmptyExperience();
  isGeneratingDescription = false;
  
  constructor(
    private messageService: MessageService,
    private aiService: AiService
  ) {}
  
  ngOnInit() {
    if (this.experienceData) {
      this.experience = { ...this.experienceData };
    }
  }
  
  getEmptyExperience(): Experience {
    return {
      jobTitle: '',
      company: '',
      location: '',
      description: '',
      current: false
    };
  }
  
  canGenerateDescription(): boolean {
    return !!this.experience.jobTitle && !!this.experience.company;
  }
  
  generateDescription() {
    if (!this.canGenerateDescription()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Information',
        detail: 'Please enter the job title and company name first.'
      });
      return;
    }
    
    this.isGeneratingDescription = true;
    const initialDescription = this.experience.description || 'Responsible for developing software applications.';
    
    this.aiService.enhanceDescription(
      this.experience.jobTitle,
      this.experience.company,
      initialDescription
    ).subscribe({
      next: (enhancedDescription) => {
        this.experience.description = enhancedDescription;
        this.isGeneratingDescription = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Description Generated',
          detail: 'Your experience description has been enhanced with AI.'
        });
      },
      error: (error) => {
        console.error('Error generating description:', error);
        this.isGeneratingDescription = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Generation Failed',
          detail: 'Failed to generate description. Please try again later.'
        });
      }
    });
  }
  
  isExperienceValid(): boolean {
    return !!this.experience.jobTitle && 
          !!this.experience.company && 
          !!this.experience.description;
  }
  
  save() {
    if (this.isExperienceValid()) {
      this.saved.emit(this.experience);
    }
  }
  
  cancel() {
    this.cancelled.emit();
  }
} 