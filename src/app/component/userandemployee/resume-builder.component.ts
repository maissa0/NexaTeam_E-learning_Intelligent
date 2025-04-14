import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { EditorModule } from 'primeng/editor';
import { StepsModule } from 'primeng/steps';
import { MenuItem, MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
import { ResumeService, ResumeDTO } from '../../services/resume.service';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    DividerModule,
    EditorModule,
    StepsModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  template: `
    <div class="resume-builder-container p-4">
      <div class="step-navigation mb-4">
        <p-steps [model]="items" [readonly]="false" [activeIndex]="activeIndex" (activeIndexChange)="onActiveIndexChange($event)"></p-steps>
      </div>

      <div class="grid">
        <!-- Form Section -->
        <div class="col-12 lg:col-6">
          <p-card [header]="sectionTitles[activeIndex]" styleClass="resume-section-card">
            <ng-container [ngSwitch]="activeIndex">
              <!-- Personal Information Section -->
              <div *ngSwitchCase="0" class="personal-info-section">
                <form [formGroup]="resumeForm">
                  <div class="grid">
                    <div class="col-12 md:col-6 mb-3">
                      <label for="firstName" class="block mb-2">First Name</label>
                      <input id="firstName" type="text" pInputText formControlName="firstName" class="w-full" />
                    </div>
                    <div class="col-12 md:col-6 mb-3">
                      <label for="lastName" class="block mb-2">Last Name</label>
                      <input id="lastName" type="text" pInputText formControlName="lastName" class="w-full" />
                    </div>
                    <div class="col-12 md:col-6 mb-3">
                      <label for="email" class="block mb-2">Email</label>
                      <input id="email" type="email" pInputText formControlName="email" class="w-full" />
                    </div>
                    <div class="col-12 md:col-6 mb-3">
                      <label for="phone" class="block mb-2">Phone</label>
                      <input id="phone" type="tel" pInputText formControlName="phone" class="w-full" />
                    </div>
                    <div class="col-12 mb-3">
                      <label for="title" class="block mb-2">Professional Title</label>
                      <input id="title" type="text" pInputText formControlName="title" class="w-full" />
                    </div>
                    <div class="col-12 mb-3">
                      <label for="location" class="block mb-2">Location</label>
                      <input id="location" type="text" pInputText formControlName="location" class="w-full" />
                    </div>
                  </div>
                </form>
              </div>

              <!-- Summary Section -->
              <div *ngSwitchCase="1" class="summary-section">
                <div class="mb-3">
                  <div class="flex justify-content-between align-items-center mb-2">
                    <label for="summary" class="block">Professional Summary</label>
                    <button pButton 
                            [disabled]="isGeneratingSummary" 
                            icon="pi pi-bolt" 
                            label="{{isGeneratingSummary ? 'Generating...' : 'Generate with AI'}}"
                            class="p-button-sm p-button-outlined p-button-danger"
                            (click)="generateSummaryWithAI()">
                      <i *ngIf="isGeneratingSummary" class="pi pi-spin pi-spinner ml-2"></i>
                    </button>
                  </div>
                  <p-editor [(ngModel)]="summaryContent" [style]="{'height':'320px'}" styleClass="w-full">
                    <ng-template pTemplate="header">
                      <span class="ql-formats">
                        <button type="button" class="ql-bold" aria-label="Bold"></button>
                        <button type="button" class="ql-italic" aria-label="Italic"></button>
                        <button type="button" class="ql-underline" aria-label="Underline"></button>
                      </span>
                      <span class="ql-formats">
                        <button type="button" class="ql-list" value="ordered" aria-label="Ordered List"></button>
                        <button type="button" class="ql-list" value="bullet" aria-label="Bullet List"></button>
                      </span>
                    </ng-template>
                  </p-editor>
                  <small class="block mt-2 text-secondary">Write a compelling professional summary that highlights your skills and experience.</small>
                </div>
              </div>

              <!-- Experience Section -->
              <div *ngSwitchCase="2" class="experience-section">
                <form [formGroup]="resumeForm">
                  <div *ngFor="let exp of experiences; let i = index" class="experience-item mb-4 p-3 border-1 border-round surface-border">
                    <div class="flex justify-content-between mb-2">
                      <h3 class="m-0">Experience #{{i + 1}}</h3>
                      <div class="flex gap-2">
                        <button pButton pRipple 
                                icon="pi pi-bolt" 
                                [disabled]="exp.isGenerating || !exp.jobTitle || !exp.company"
                                class="p-button-rounded p-button-primary p-button-text" 
                                title="Generate with AI"
                                (click)="generateJobDescription(i)">
                          <i *ngIf="exp.isGenerating" class="pi pi-spin pi-spinner ml-2"></i>
                        </button>
                        <button *ngIf="exp.description" 
                                pButton pRipple 
                                icon="pi pi-refresh" 
                                [disabled]="exp.isEnhancing"
                                class="p-button-rounded p-button-success p-button-text" 
                                title="Enhance with AI"
                                (click)="enhanceJobDescription(i)">
                          <i *ngIf="exp.isEnhancing" class="pi pi-spin pi-spinner ml-2"></i>
                        </button>
                        <button *ngIf="i > 0" 
                                pButton pRipple 
                                icon="pi pi-trash" 
                                class="p-button-rounded p-button-danger p-button-text" 
                                (click)="removeExperience(i)"></button>
                      </div>
                    </div>
                    <div class="grid">
                      <div class="col-12 mb-3">
                        <label for="jobTitle{{i}}" class="block mb-2">Job Title</label>
                        <input id="jobTitle{{i}}" type="text" pInputText [(ngModel)]="exp.jobTitle" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 mb-3">
                        <label for="company{{i}}" class="block mb-2">Company</label>
                        <input id="company{{i}}" type="text" pInputText [(ngModel)]="exp.company" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 md:col-6 mb-3">
                        <label for="startDate{{i}}" class="block mb-2">Start Date (MM/YYYY)</label>
                        <input id="startDate{{i}}" type="month" pInputText [(ngModel)]="exp.startDate" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 md:col-6 mb-3">
                        <label for="endDate{{i}}" class="block mb-2">End Date (MM/YYYY)</label>
                        <input id="endDate{{i}}" type="month" pInputText [(ngModel)]="exp.endDate" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 mb-3">
                        <div class="flex justify-content-between align-items-center mb-2">
                          <label for="description{{i}}" class="block">Description</label>
                          <small *ngIf="!exp.description && exp.jobTitle && exp.company" class="text-info">
                            <i class="pi pi-info-circle mr-1"></i>Click <i class="pi pi-bolt mx-1"></i> to generate
                          </small>
                        </div>
                        <textarea id="description{{i}}" pInputTextarea [(ngModel)]="exp.description" [ngModelOptions]="{standalone: true}" 
                                 class="w-full" rows="4"></textarea>
                      </div>
                    </div>
                  </div>
                  <button pButton label="Add Experience" icon="pi pi-plus" class="p-button-outlined" (click)="addExperience()"></button>
                </form>
              </div>

              <!-- Education Section -->
              <div *ngSwitchCase="3" class="education-section">
                <form [formGroup]="resumeForm">
                  <div *ngFor="let edu of educations; let i = index" class="education-item mb-4 p-3 border-1 border-round surface-border">
                    <div class="flex justify-content-between mb-2">
                      <h3 class="m-0">Education #{{i + 1}}</h3>
                      <button *ngIf="i > 0" pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                              (click)="removeEducation(i)"></button>
                    </div>
                    <div class="grid">
                      <div class="col-12 mb-3">
                        <label for="degree{{i}}" class="block mb-2">Degree</label>
                        <input id="degree{{i}}" type="text" pInputText [(ngModel)]="edu.degree" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 mb-3">
                        <label for="institution{{i}}" class="block mb-2">Institution</label>
                        <input id="institution{{i}}" type="text" pInputText [(ngModel)]="edu.institution" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 md:col-6 mb-3">
                        <label for="eduStartDate{{i}}" class="block mb-2">Start Date (MM/YYYY)</label>
                        <input id="eduStartDate{{i}}" type="month" pInputText [(ngModel)]="edu.startDate" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                      <div class="col-12 md:col-6 mb-3">
                        <label for="eduEndDate{{i}}" class="block mb-2">End Date (MM/YYYY)</label>
                        <input id="eduEndDate{{i}}" type="month" pInputText [(ngModel)]="edu.endDate" [ngModelOptions]="{standalone: true}" class="w-full" />
                      </div>
                    </div>
                  </div>
                  <button pButton label="Add Education" icon="pi pi-plus" class="p-button-outlined" (click)="addEducation()"></button>
                </form>
              </div>

              <!-- Skills Section -->
              <div *ngSwitchCase="4" class="skills-section">
                <div class="skills-header flex justify-content-between align-items-center mb-3">
                  <h3 class="m-0">Skills</h3>
                  <button pButton 
                          [disabled]="isGeneratingSkills" 
                          icon="pi pi-bolt" 
                          label="{{isGeneratingSkills ? 'Generating...' : 'Suggest Skills with AI'}}"
                          class="p-button-sm p-button-outlined p-button-danger"
                          (click)="suggestSkills()">
                    <i *ngIf="isGeneratingSkills" class="pi pi-spin pi-spinner ml-2"></i>
                  </button>
                </div>
                
                <div *ngFor="let skill of skills; let i = index" class="mb-4">
                  <div class="flex justify-content-between align-items-center mb-2">
                    <label [for]="'skill-name-' + i" class="m-0 font-medium">Skill</label>
                    <button *ngIf="i > 0" pButton pRipple icon="pi pi-trash" 
                            class="p-button-rounded p-button-danger p-button-text p-button-sm" 
                            (click)="removeSkill(i)"></button>
                  </div>
                  <input [id]="'skill-name-' + i" type="text" pInputText [(ngModel)]="skill.name" 
                         [ngModelOptions]="{standalone: true}" class="w-full mb-2" 
                         placeholder="Enter skill (e.g., React, Node.js)">
                  
                  <div class="proficiency-selector flex flex-wrap gap-2">
                    <button *ngFor="let level of proficiencyLevels" 
                            pButton type="button" 
                            [class.p-button-outlined]="skill.level !== level"
                            [class.p-button-filled]="skill.level === level"
                            class="p-button-sm" 
                            [label]="level"
                            (click)="selectProficiency(skill, level)"></button>
                  </div>
                </div>
                
                <div class="flex gap-2 mt-3">
                  <button pButton icon="pi pi-plus" label="Add" 
                          class="p-button-outlined p-button-sm" 
                          (click)="addSkill()"></button>
                  <button pButton icon="pi pi-times" label="Remove" 
                          class="p-button-outlined p-button-danger p-button-sm"
                          [disabled]="skills.length <= 1"
                          (click)="removeSkill(skills.length - 1)"></button>
                </div>
              </div>
            </ng-container>

            <div class="flex justify-content-between mt-4">
              <button pButton label="Previous" icon="pi pi-chevron-left" [disabled]="activeIndex === 0" 
                      (click)="activeIndex = activeIndex - 1" class="p-button-outlined"></button>
              <button pButton [label]="activeIndex === 4 ? 'Submit' : 'Next'" 
                      [icon]="activeIndex === 4 ? 'pi pi-check' : 'pi pi-chevron-right'" 
                      (click)="activeIndex === 4 ? submitResume() : activeIndex = activeIndex + 1"></button>
            </div>
          </p-card>
        </div>

        <!-- Preview Section -->
        <div class="col-12 lg:col-6">
          <p-card header="Resume Preview" styleClass="resume-preview-card">
            <div class="resume-preview">
              <!-- Header -->
              <div class="resume-header">
                <h1 class="resume-name">{{resumeForm.get('firstName')?.value || 'John'}} {{resumeForm.get('lastName')?.value || 'Doe'}}</h1>
                <h2 class="resume-title">{{resumeForm.get('title')?.value || 'Professional Title'}}</h2>
                
                <div class="resume-contact flex flex-wrap gap-3 justify-content-center">
                  <span *ngIf="resumeForm.get('email')?.value">
                    <i class="pi pi-envelope mr-2"></i>{{resumeForm.get('email')?.value}}
                  </span>
                  <span *ngIf="resumeForm.get('phone')?.value">
                    <i class="pi pi-phone mr-2"></i>{{resumeForm.get('phone')?.value}}
                  </span>
                  <span *ngIf="resumeForm.get('location')?.value">
                    <i class="pi pi-map-marker mr-2"></i>{{resumeForm.get('location')?.value}}
                  </span>
                </div>
              </div>
              
              <p-divider></p-divider>
              
              <!-- Summary -->
              <div *ngIf="summaryContent" class="resume-section">
                <h3 class="section-title">Professional Summary</h3>
                <div class="html-content" [innerHTML]="summaryContent"></div>
              </div>
              
              <!-- Experience -->
              <div *ngIf="experiences.length > 0" class="resume-section">
                <h3 class="section-title">Work Experience</h3>
                <div *ngFor="let exp of experiences" class="mb-3">
                  <div class="flex justify-content-between">
                    <h4 class="job-title m-0">{{exp.jobTitle || 'Job Title'}}</h4>
                    <span class="job-dates">
                      {{formatDate(exp.startDate)}} - {{exp.endDate ? formatDate(exp.endDate) : 'Present'}}
                    </span>
                  </div>
                  <h5 class="company-name mt-1 mb-2">{{exp.company || 'Company Name'}}</h5>
                  <p class="job-description">{{exp.description || 'Job description goes here'}}</p>
                </div>
              </div>
              
              <!-- Education -->
              <div *ngIf="educations.length > 0" class="resume-section">
                <h3 class="section-title">Education</h3>
                <div *ngFor="let edu of educations" class="mb-3">
                  <div class="flex justify-content-between">
                    <h4 class="degree-title m-0">{{edu.degree || 'Degree'}}</h4>
                    <span class="education-dates">
                      {{formatDate(edu.startDate)}} - {{edu.endDate ? formatDate(edu.endDate) : 'Present'}}
                    </span>
                  </div>
                  <h5 class="institution-name mt-1">{{edu.institution || 'Institution Name'}}</h5>
                </div>
              </div>
              
              <!-- Skills -->
              <div *ngIf="skills.length > 0 && skills[0].name" class="resume-section">
                <h3 class="section-title">Skills</h3>
                <div class="skills-list">
                  <div *ngFor="let skill of skills" class="skill-item mb-2">
                    <div class="flex justify-content-between">
                      <span class="skill-name font-medium">{{skill.name}}</span>
                      <span class="skill-level" [ngClass]="{'text-primary': skill.level === 'Expert', 
                                                           'text-success': skill.level === 'Advanced',
                                                           'text-warning': skill.level === 'Moderate',
                                                           'text-secondary': skill.level === 'Basic',
                                                           'text-danger': skill.level === 'Poor'}">
                        {{skill.level}}
                      </span>
                    </div>
                    <div class="skill-bar mt-1">
                      <div class="skill-progress" 
                           [ngStyle]="{'width': skill.level === 'Expert' ? '100%' : 
                                               skill.level === 'Advanced' ? '80%' : 
                                               skill.level === 'Moderate' ? '60%' : 
                                               skill.level === 'Basic' ? '40%' : '20%',
                                      'background-color': skill.level === 'Expert' ? '#3B82F6' :
                                                         skill.level === 'Advanced' ? '#10B981' :
                                                         skill.level === 'Moderate' ? '#F59E0B' :
                                                         skill.level === 'Basic' ? '#6B7280' : '#EF4444'}">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-builder-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .resume-section-card, .resume-preview-card {
      height: 100%;
      margin-bottom: 2rem;
    }
    .resume-preview-card {
      background-color: #f8f9fa;
    }
    .resume-preview {
      background-color: white;
      padding: 30px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      min-height: 500px;
    }
    :host ::ng-deep .p-steps-item {
      cursor: pointer;
    }
    :host ::ng-deep .p-steps .p-steps-item .p-menuitem-link {
      background: transparent;
    }
    :host ::ng-deep .p-editor-container .p-editor-toolbar {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
    :host ::ng-deep .p-editor-container .p-editor-content {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
    .resume-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .resume-name {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .resume-title {
      font-size: 1.25rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }
    .resume-contact {
      font-size: 0.9rem;
    }
    .section-title {
      color: #2196F3;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .job-title, .degree-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .company-name, .institution-name {
      font-weight: 400;
      color: #6c757d;
    }
    .job-dates, .education-dates {
      font-size: 0.9rem;
      color: #6c757d;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
    }
    .html-content {
      line-height: 1.6;
    }
    .skill-bar {
      height: 6px;
      background-color: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .skill-progress {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .proficiency-selector button {
      flex: 1;
      min-width: 60px;
    }
    
    .text-primary { color: #3B82F6; }
    .text-success { color: #10B981; }
    .text-warning { color: #F59E0B; }
    .text-secondary { color: #6B7280; }
    .text-danger { color: #EF4444; }
  `]
})
export class ResumeBuilderComponent {
  items: MenuItem[];
  activeIndex = 0;
  resumeForm: FormGroup;
  summaryContent: string = '';
  experiences: any[] = [{ 
    jobTitle: '', 
    company: '', 
    startDate: null, 
    endDate: null, 
    description: '', 
    isEnhancing: false,
    isGenerating: false 
  }];
  educations: any[] = [{ degree: '', institution: '', startDate: null, endDate: null }];
  skills: any[] = [{ name: '', level: 'Moderate' }];
  proficiencyLevels: string[] = ['Poor', 'Basic', 'Moderate', 'Advanced', 'Expert'];
  sectionTitles: string[] = [
    'Personal Information',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills'
  ];
  isGeneratingSummary: boolean = false;
  isGeneratingSkills: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private messageService: MessageService,
    private aiService: AiService,
    private authService: AuthService,
    private resumeService: ResumeService
  ) {
    this.items = [
      { label: 'Personal' },
      { label: 'Summary' },
      { label: 'Experience' },
      { label: 'Education' },
      { label: 'Skills' }
    ];

    this.resumeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      title: [''],
      location: ['']
    });
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  addExperience() {
    this.experiences.push({ 
      jobTitle: '', 
      company: '', 
      startDate: null, 
      endDate: null, 
      description: '', 
      isEnhancing: false,
      isGenerating: false 
    });
  }

  removeExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  addEducation() {
    this.educations.push({ degree: '', institution: '', startDate: null, endDate: null });
  }

  removeEducation(index: number) {
    this.educations.splice(index, 1);
  }

  formatDate(date: any): string {
    if (!date) return '';
    
    try {
      // For handling 'yyyy-MM' format from input[type="month"]
      const parts = date.split('-');
      if (parts.length === 2) {
        const year = parts[0];
        const month = new Date(date + '-01').toLocaleString('default', { month: 'short' });
        return `${month} ${year}`;
      }
      
      // For handling Date objects
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
      }
      
      return date;
    } catch (error) {
      return date;
    }
  }

  addSkill() {
    this.skills.push({ name: '', level: 'Moderate' });
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }
  
  selectProficiency(skill: any, level: string) {
    skill.level = level;
  }
  
  /**
   * Generate a professional summary using the AI service
   */
  generateSummaryWithAI() {
    const jobTitle = this.resumeForm.get('title')?.value;
    
    if (!jobTitle) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please enter your professional title first'
      });
      return;
    }
    
    // Get skill names for better summary generation
    const skillNames = this.skills
      .filter(skill => skill.name.trim() !== '')
      .map(skill => skill.name);
    
    if (skillNames.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Tip',
        detail: 'Adding skills will help create a better summary. We\'ll generate one with just your title for now.'
      });
    }
    
    this.isGeneratingSummary = true;
    
    this.aiService.generateSummary(jobTitle, skillNames).subscribe({
      next: (summary) => {
        this.summaryContent = summary;
        this.isGeneratingSummary = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Summary Generated',
          detail: 'Your professional summary has been created with AI'
        });
      },
      error: (error) => {
        console.error('Error generating summary:', error);
        this.isGeneratingSummary = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Generation Failed',
          detail: 'Could not generate summary. Please try again later.'
        });
      }
    });
  }
  
  /**
   * Enhance a job description with AI
   */
  enhanceJobDescription(index: number) {
    const experience = this.experiences[index];
    
    if (!experience.jobTitle || !experience.company) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Information',
        detail: 'Please enter both Job Title and Company before enhancing the description.'
      });
      return;
    }
    
    if (!experience.description) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Description',
        detail: 'Please enter a basic description first, which will be enhanced with AI.'
      });
      return;
    }
    
    // Set enhancing flag to show loading state
    experience.isEnhancing = true;
    
    this.aiService.enhanceDescription(
      experience.jobTitle,
      experience.company,
      experience.description
    ).subscribe({
      next: (enhancedDescription) => {
        experience.description = enhancedDescription;
        experience.isEnhancing = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Description Enhanced',
          detail: 'Your job description has been professionally enhanced with AI.'
        });
      },
      error: (error) => {
        console.error('Error enhancing description:', error);
        experience.isEnhancing = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Enhancement Failed',
          detail: error.message || 'Failed to enhance description. Please try again later.'
        });
      }
    });
  }
  
  /**
   * Suggest relevant skills based on job title
   */
  suggestSkills() {
    const jobTitle = this.resumeForm.get('title')?.value;
    
    if (!jobTitle) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please enter your professional title to get skill suggestions'
      });
      return;
    }
    
    this.isGeneratingSkills = true;
    
    this.aiService.suggestSkills(jobTitle).subscribe({
      next: (skillsString) => {
        // Parse the comma-separated skills string
        const skillNames = skillsString.split(',').map(s => s.trim());
        
        // Create new skill objects and add to the skills array
        this.skills = skillNames.map(name => ({
          name,
          level: 'Moderate' // Default level
        }));
        
        this.isGeneratingSkills = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Skills Generated',
          detail: `${skillNames.length} relevant skills have been suggested based on your title`
        });
      },
      error: (error) => {
        console.error('Error suggesting skills:', error);
        this.isGeneratingSkills = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Suggestion Failed',
          detail: 'Could not suggest skills. Please try again later.'
        });
      }
    });
  }
  
  /**
   * Generate a complete job description with AI
   */
  generateJobDescription(index: number) {
    const experience = this.experiences[index];
    
    if (!experience.jobTitle || !experience.company) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Information',
        detail: 'Please enter both Job Title and Company name first.'
      });
      return;
    }
    
    // Set generating flag to show loading state
    experience.isGenerating = true;
    
    // Initial placeholder description
    const placeholderDescription = `Responsible for ${experience.jobTitle.toLowerCase()} duties at ${experience.company}.`;
    
    this.aiService.enhanceDescription(
      experience.jobTitle,
      experience.company,
      placeholderDescription
    ).subscribe({
      next: (generatedDescription) => {
        experience.description = generatedDescription;
        experience.isGenerating = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Description Generated',
          detail: 'A professional job description has been created with AI.'
        });
      },
      error: (error) => {
        console.error('Error generating description:', error);
        experience.isGenerating = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Generation Failed',
          detail: error.message || 'Failed to generate description. Please try again later.'
        });
      }
    });
  }
  
  submitResume() {
    if (this.resumeForm.valid) {
      // Check if user is authenticated
      const currentUser = this.authService.currentUserValue;
      
      if (!currentUser) {
        this.messageService.add({
          severity: 'error',
          summary: 'Authentication Error',
          detail: 'You must be logged in to save a resume'
        });
        return;
      }
      
      // Map form data to match the backend entity structure
      const resumeData: ResumeDTO = {
        name: `${this.resumeForm.get('firstName')?.value} ${this.resumeForm.get('lastName')?.value}`,
        title: this.resumeForm.get('title')?.value || 'My Resume',
        job: this.resumeForm.get('title')?.value || '',
        address: this.resumeForm.get('location')?.value || '',
        phone: this.resumeForm.get('phone')?.value || '',
        email: this.resumeForm.get('email')?.value || currentUser.email,
        themeColor: '#3B82F6', // Default theme color
        summary: this.summaryContent,
        
        // Map experiences to match backend DTO structure
        experiences: this.experiences.filter(exp => exp.jobTitle && exp.company).map(exp => ({
          title: exp.jobTitle,
          company: exp.company,
          address: '',
          startDate: this.formatDateForBackend(exp.startDate),
          endDate: this.formatDateForBackend(exp.endDate),
          summary: exp.description
        })),
        
        // Map educations to match backend DTO structure
        educations: this.educations.filter(edu => edu.degree && edu.institution).map(edu => ({
          name: edu.institution,
          address: '',
          qualification: edu.degree,
          year: this.formatDateForBackend(edu.startDate)
        })),
        
        // Map skills to match backend DTO structure
        skills: this.skills.filter(skill => skill.name).map(skill => ({
          name: skill.name,
          level: skill.level
        }))
      };
      
      // Use the DTO approach to save all components at once
      this.resumeService.createResumeFromDTO(resumeData).subscribe({
        next: (savedResume: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Resume Saved',
            detail: 'Your resume and all its details have been saved successfully!'
          });
          
          // Navigate to profile page after short delay
          setTimeout(() => {
            this.router.navigate(['/user/profile']);
          }, 1500);
        },
        error: (error: any) => {
          console.error('Error saving resume:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: error.error?.message || 'Could not save resume. Please try again later.'
          });
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.resumeForm.controls).forEach(key => {
        this.resumeForm.get(key)?.markAsTouched();
      });
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please complete all required fields before submitting'
      });
    }
  }
  
  /**
   * Format date for backend storage (YYYY-MM-DD)
   */
  formatDateForBackend(date: any): string {
    if (!date) return '';
    
    try {
      // For handling 'yyyy-MM' format from input[type="month"]
      const parts = String(date).split('-');
      if (parts.length === 2) {
        return `${parts[0]}-${parts[1]}-01`; // Add day as 01
      }
      
      // For handling Date objects
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split('T')[0];
      }
      
      return date;
    } catch (error) {
      return date;
    }
  }
} 