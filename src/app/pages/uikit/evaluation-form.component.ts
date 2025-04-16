import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { EvaluationForm, EvaluationStatus } from '../models/evaluation-form.model';
import { QuestionResponse, JobOfferRequest } from '../models/job-offer-request.model';
import { EvaluationFormService } from '../service/evaluation-form.service';
import { AiInterviewService } from '../service/ai-interview.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-evaluation-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        DividerModule,
        DialogModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, EvaluationFormService, AiInterviewService, ConfirmationService],
    template: `
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="card">
            <div class="flex justify-content-between align-items-center mb-4">
                <h2 class="m-0">Evaluation Form</h2>
            </div>
            
            <div class="grid">
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="evaluatorName">Evaluator Name</label>
                        <input id="evaluatorName" type="text" pInputText [(ngModel)]="evaluationForm.evaluatorName" class="w-full">
                    </div>
                </div>
                
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="applicationId">Application ID</label>
                        <input id="applicationId" type="text" pInputText [(ngModel)]="evaluationForm.applicationId" class="w-full">
                    </div>
                </div>
            </div>

            <p-divider></p-divider>

            <!-- Questions Section -->
            <div class="questions-section mt-4">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h3 class="m-0">Interview Questions</h3>
                    <div class="flex gap-2" *ngIf="!isViewMode">
                        <p-button 
                            label="Generate Questions" 
                            icon="pi pi-refresh" 
                            (onClick)="generateQuestions()"
                            [loading]="isGenerating"
                            severity="info">
                        </p-button>
                        <p-button 
                            label="Add Question" 
                            icon="pi pi-plus" 
                            (onClick)="showAddQuestionDialog()"
                            severity="success">
                        </p-button>
                    </div>
                </div>

                <!-- Questions List -->
                <div *ngFor="let question of questions; let i = index" class="mb-4">
                    <p-card [style]="{'background': '#f8f9fa'}">
                        <div class="grid">
                            <div class="col-12 md:col-9">
                                <p class="text-lg line-height-3 m-0">{{question.question}}</p>
                            </div>
                            <div class="col-12 md:col-3">
                                <div class="field">
                                    <label [for]="'mark_' + i" class="font-bold block mb-2">Score</label>
                                    <p-inputNumber 
                                        [id]="'mark_' + i"
                                        [(ngModel)]="question.mark"
                                        [min]="0"
                                        [max]="100"
                                        [style]="{'width': '100px'}"
                                        [inputStyle]="{'width': '100px'}"
                                        [showButtons]="true"
                                        [disabled]="isViewMode"
                                        buttonLayout="horizontal"
                                        spinnerMode="horizontal"
                                        [step]="5"
                                        decrementButtonClass="p-button-secondary"
                                        incrementButtonClass="p-button-secondary"
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus">
                                    </p-inputNumber>
                                </div>
                            </div>
                        </div>
                    </p-card>
                </div>
            </div>

            <p-divider></p-divider>

            <!-- Overall Feedback -->
            <div class="field mt-4">
                <label for="overallFeedback" class="font-bold block mb-2">Overall Feedback</label>
                <textarea 
                    id="overallFeedback" 
                    pInputTextarea 
                    [(ngModel)]="evaluationForm.overallFeedback" 
                    [rows]="5" 
                    class="w-full"
                    [disabled]="isViewMode">
                </textarea>
            </div>

            <!-- Submit Button -->
            <div *ngIf="!isViewMode" class="flex justify-content-end mt-4">
                <p-button 
                    label="Submit Evaluation" 
                    icon="pi pi-check" 
                    (onClick)="submitEvaluation()"
                    [disabled]="questions.length === 0">
                </p-button>
            </div>
        </div>

        <!-- Add Question Dialog -->
        <p-dialog 
            [(visible)]="showAddDialog" 
            header="Add New Question" 
            [modal]="true" 
            [style]="{width: '50vw'}"
            [draggable]="false" 
            [resizable]="false">
            <div class="grid p-fluid">
                <div class="col-12">
                    <label for="newQuestionText" class="font-bold block mb-2">Question</label>
                    <textarea 
                        id="newQuestionText" 
                        pInputTextarea 
                        [(ngModel)]="newQuestion.question" 
                        [rows]="3" 
                        class="w-full">
                    </textarea>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    (onClick)="showAddDialog = false" 
                    styleClass="p-button-text">
                </p-button>
                <p-button 
                    label="Add" 
                    icon="pi pi-check" 
                    (onClick)="addQuestion()" 
                    [disabled]="!isNewQuestionValid()">
                </p-button>
            </ng-template>
        </p-dialog>
    `
})
export class EvaluationFormComponent implements OnInit {
    evaluationForm: EvaluationForm = {
        applicationId: '',
        evaluatorId: '',
        evaluatorName: '',
        scores: {},
        overallFeedback: '',
        status: EvaluationStatus.PENDING,
        createdAt: new Date().toISOString()
    };

    questions: QuestionResponse[] = [];
    isGenerating: boolean = false;
    showAddDialog: boolean = false;
    newQuestion: QuestionResponse = {
        category: '',
        question: '',
        mark: 0
    };

    isViewMode: boolean = false;

    // Static job data for testing
    private staticJobData: JobOfferRequest = {
        title: "Senior Software Engineer",
        description: "We are looking for a senior software engineer with experience in full-stack development, particularly with Angular and Spring Boot. The ideal candidate should have strong problem-solving skills and be able to mentor junior developers.",
        requiredSkills: ["Angular", "Spring Boot", "Java", "TypeScript", "REST APIs", "Microservices"]
    };

    constructor(
        private evaluationFormService: EvaluationFormService,
        private aiInterviewService: AiInterviewService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const applicationId = params['applicationId'];
            const mode = params['mode'];
            
            if (!applicationId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No application ID provided'
                });
                this.router.navigate(['/uikit/interviews']);
                return;
            }

            this.isViewMode = mode === 'view';
            if (this.isViewMode) {
                this.loadExistingEvaluation(applicationId);
            } else {
                this.evaluationForm.applicationId = applicationId;
            }
        });
    }

    loadExistingEvaluation(applicationId: string) {
        this.evaluationFormService.getEvaluationFormByApplicationId(applicationId)
            .subscribe({
                next: (evaluation) => {
                    this.evaluationForm = evaluation;
                    // Convert scores back to questions array
                    this.questions = Object.entries(evaluation.scores).map(([question, mark]) => ({
                        category: '', // We don't need category anymore
                        question: question,
                        mark: mark
                    }));
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load evaluation form'
                    });
                    this.router.navigate(['/uikit/interviews']);
                }
            });
    }

    generateQuestions() {
        this.isGenerating = true;
        this.aiInterviewService.generateQuestions(this.staticJobData).subscribe({
            next: (questions) => {
                this.questions = questions;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Questions generated successfully'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate questions'
                });
                console.error('Error generating questions:', error);
            },
            complete: () => {
                this.isGenerating = false;
            }
        });
    }

    submitEvaluation() {
        if (!this.evaluationForm.applicationId || !this.evaluationForm.evaluatorName) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields (Evaluator Name and Application ID)'
            });
            return;
        }

        if (this.questions.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please add at least one question before submitting'
            });
            return;
        }

        // Store questions and their marks directly
        this.evaluationForm.scores = this.questions.reduce((acc, question) => {
            acc[question.question] = question.mark || 0;
            return acc;
        }, {} as { [key: string]: number });

        console.log('Submitting evaluation form:', this.evaluationForm);

        this.evaluationFormService.createEvaluationForm(this.evaluationForm)
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Evaluation submitted successfully'
                    });
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Error submitting evaluation:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to submit evaluation'
                    });
                }
            });
    }

    showAddQuestionDialog() {
        this.newQuestion = {
            category: '',
            question: '',
            mark: 0
        };
        this.showAddDialog = true;
    }

    isNewQuestionValid(): boolean {
        return this.newQuestion.question.trim().length > 0;
    }

    addQuestion() {
        if (this.newQuestion.question.trim()) {
            this.questions.push({
                category: '',
                question: this.newQuestion.question.trim(),
                mark: 0
            });
            this.showAddDialog = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Question added successfully'
            });
        }
    }

    confirmDeleteQuestion(index: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this question?',
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.questions.splice(index, 1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Question deleted'
                });
            }
        });
    }

    resetForm() {
        this.evaluationForm = {
            applicationId: '',
            evaluatorId: '',
            evaluatorName: '',
            scores: {},
            overallFeedback: '',
            status: EvaluationStatus.PENDING,
            createdAt: new Date().toISOString()
        };
        this.questions = [];
        this.showAddDialog = false;
    }
} 