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
            <div class="flex justify-content-between align-items-center mb-5">
                <h2 class="m-0">{{ isViewMode ? 'Evaluation Details' : 'Evaluation Form' }}</h2>
                <p-button *ngIf="!isViewMode"
                    label="Generate Questions" 
                    icon="pi pi-refresh" 
                    (onClick)="generateQuestions()"
                    [loading]="isGenerating"
                    severity="info">
                </p-button>
            </div>
            
            <div class="grid">
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="evaluatorName" class="font-bold">Evaluator Name</label>
                        <input id="evaluatorName" type="text" pInputText 
                            [(ngModel)]="evaluationForm.evaluatorName" 
                            [disabled]="isViewMode"
                            class="w-full">
                    </div>
                </div>
                
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="applicationId" class="font-bold">Application ID</label>
                        <input id="applicationId" type="text" pInputText 
                            [(ngModel)]="evaluationForm.applicationId" 
                            [disabled]="true"
                            class="w-full">
                    </div>
                </div>
            </div>

            <p-divider></p-divider>

            <!-- Create Mode: Questions Section -->
            <div *ngIf="!isViewMode" class="questions-section mt-4">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h3 class="m-0">Interview Questions</h3>
                    <p-button 
                        label="Add Question" 
                        icon="pi pi-plus" 
                        (onClick)="showAddQuestionDialog()"
                        severity="success">
                    </p-button>
                </div>

                <div *ngFor="let question of questions; let i = index" class="mb-4">
                    <p-card [style]="{'background': '#f8f9fa'}">
                        <div class="grid">
                            <div class="col-12 mb-3">
                                <div class="flex justify-content-between align-items-center">
                                    <span class="font-bold text-lg text-primary">Category: {{question.category}}</span>
                                    <p-button 
                                        icon="pi pi-trash" 
                                        (onClick)="confirmDeleteQuestion(i)"
                                        severity="danger" 
                                        text>
                                    </p-button>
                                </div>
                            </div>
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
                                        [showButtons]="true"
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

            <!-- View Mode: Scores Section -->
            <div *ngIf="isViewMode" class="evaluation-view">
                <div class="surface-card p-4 shadow-2 border-round">
                    <!-- Header -->
                    <div class="text-center mb-5">
                        <h2 class="text-3xl font-semibold mb-2">Evaluation Summary</h2>
                        <div class="text-600">Application ID: {{evaluationForm.applicationId}}</div>
                        <div class="text-600">Evaluator: {{evaluationForm.evaluatorName}}</div>
                    </div>

                    <!-- Scores Grid -->
                    <div class="grid">
                        <div *ngFor="let score of getScoresArray()" class="col-12 md:col-6 xl:col-4 mb-4">
                            <div class="surface-card p-3 border-round shadow-1 h-full">
                                <div class="flex align-items-center justify-content-between">
                                    <span class="text-xl font-medium">{{score.category}}</span>
                                    <div class="score-badge" 
                                        [ngClass]="{
                                            'bg-green-100 text-green-700': score.value >= 70,
                                            'bg-yellow-100 text-yellow-700': score.value >= 50 && score.value < 70,
                                            'bg-red-100 text-red-700': score.value < 50
                                        }">
                                        {{score.value}}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Final Score -->
                    <div class="mt-5 mb-5">
                        <div class="surface-card p-4 border-round shadow-2">
                            <h3 class="text-2xl font-semibold text-center mb-4">Final Score</h3>
                            <div class="flex justify-content-center">
                                <div class="final-score"
                                    [ngClass]="{
                                        'bg-green-100 text-green-700': getFinalScore() >= 70,
                                        'bg-yellow-100 text-yellow-700': getFinalScore() >= 50 && getFinalScore() < 70,
                                        'bg-red-100 text-red-700': getFinalScore() < 50
                                    }">
                                    <span class="score-value">{{getFinalScore()}}</span>
                                    <span class="score-max">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feedback Section -->
                    <div class="mt-5">
                        <div class="surface-card p-4 border-round shadow-2">
                            <h3 class="text-2xl font-semibold mb-3">Overall Feedback</h3>
                            <p class="text-lg line-height-3 text-700">
                                {{evaluationForm.overallFeedback || 'No feedback provided.'}}
                            </p>
                        </div>
                    </div>

                    <!-- Back Button -->
                    <div class="flex justify-content-center mt-5">
                        <p-button 
                            label="Back to Interviews" 
                            icon="pi pi-arrow-left" 
                            (onClick)="navigateBack()"
                            styleClass="p-button-rounded">
                        </p-button>
                    </div>
                </div>
            </div>

            <!-- Submit Button - only in create mode -->
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
                <div class="col-12 mb-3">
                    <label for="newCategory" class="font-bold block mb-2">Category</label>
                    <input id="newCategory" type="text" pInputText [(ngModel)]="newQuestion.category">
                </div>
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
    `,
    styles: [`
        .evaluation-view {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .score-badge {
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-weight: 600;
            font-size: 1.1rem;
        }
        .final-score {
            padding: 1.5rem 3rem;
            border-radius: 1rem;
            text-align: center;
            font-weight: 700;
            display: inline-block;
        }
        .final-score .score-value {
            font-size: 3.5rem;
            margin-right: 0.5rem;
        }
        .final-score .score-max {
            font-size: 1.5rem;
            opacity: 0.8;
        }
    `]
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
                    // Convert scores back to questions
                    this.questions = Object.entries(evaluation.scores).map(([category, score]) => ({
                        category,
                        question: '', // You might want to store the actual questions in your backend
                        mark: score
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
        // Convert questions marks to scores map
        this.evaluationForm.scores = this.questions.reduce((acc, q) => {
            acc[q.category] = q.mark || 0;
            return acc;
        }, {} as { [key: string]: number });

        this.evaluationFormService.createEvaluationForm(this.evaluationForm)
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Evaluation submitted successfully'
                    });
                },
                error: (error) => {
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
        return this.newQuestion.category.trim().length > 0 && 
               this.newQuestion.question.trim().length > 0;
    }

    addQuestion() {
        if (this.isNewQuestionValid()) {
            this.questions.push({ ...this.newQuestion });
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

    getPerformanceLabel(): string {
        const score = this.getFinalScore();
        if (score >= 90) return 'Outstanding';
        if (score >= 80) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Average';
        return 'Needs Improvement';
    }

    getFinalScore(): number {
        const scores = this.getScoresArray();
        if (scores.length === 0) return 0;
        
        const sum = scores.reduce((acc, score) => acc + score.value, 0);
        return Math.round(sum / scores.length);
    }

    getScoresArray(): { category: string, value: number }[] {
        if (!this.evaluationForm.scores) return [];
        
        return Object.entries(this.evaluationForm.scores).map(([category, value]) => ({
            category,
            value
        }));
    }

    // Add back navigation
    navigateBack() {
        this.router.navigate(['/uikit/interviews']);
    }
} 