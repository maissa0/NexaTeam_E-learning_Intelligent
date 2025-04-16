import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar'; 
import { Interview, InterviewStatus } from '../models/interview.model';
import InterviewService from '../service/interview.service';
import { DropdownModule } from 'primeng/dropdown'; 
import { Router } from '@angular/router';
import { EvaluationFormService } from '../service/evaluation-form.service';
import { map, catchError, forkJoin, of } from 'rxjs';


@Component({
    selector: 'app-interviews',
    standalone: true,
    providers: [MessageService, InterviewService, ConfirmationService],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        CalendarModule,
        DropdownModule
    ],
    template: `
        <p-toolbar>
            <ng-template #start>
                <p-button label="New Interview" icon="pi pi-plus" (onClick)="openNew()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="interviews()"
            [paginator]="true"
            [rows]="10"
            dataKey="interviewId"
        >
            <ng-template #header>
                <tr>
                    <th pSortableColumn="applicationId">Application ID <p-sortIcon field="applicationId" /></th>
                    <th pSortableColumn="scheduledDateTime">Scheduled Date <p-sortIcon field="scheduledDateTime" /></th>
                    <th>Meeting Link</th>
                    <th>Recording Link</th>
                    <th>Status</th>
                    <th>Evaluation</th>
                    <th>Actions</th>
                </tr>
            </ng-template>

            <ng-template #body let-interview>
                <tr>
                    <td>{{ interview.applicationId }}</td>
                    <td>{{ interview.scheduledDateTime | date:'yyyy-MM-dd HH:mm' }}</td>
                    <td>
                        <a *ngIf="interview.meetingLink" [href]="interview.meetingLink" target="_blank">
                            {{ interview.meetingLink }}
                        </a>
                        <span *ngIf="!interview.meetingLink">No Link</span>
                    </td>
                    <td>
                        <a *ngIf="interview.recordingLink" [href]="interview.recordingLink" target="_blank">
                            {{ interview.recordingLink }}
                        </a>
                        <span *ngIf="!interview.recordingLink">No Link</span>
                    </td>
                    <td>{{ interview.status }}</td>
                    <td>
                        <p-button *ngIf="!interview.hasEvaluation"
                            icon="pi pi-plus"
                            label="Create"
                            severity="success"
                            (onClick)="navigateToEvaluation(interview, 'create')">
                        </p-button>
                        <p-button *ngIf="interview.hasEvaluation"
                            icon="pi pi-eye"
                            label="View"
                            severity="info"
                            (onClick)="navigateToEvaluation(interview, 'view')">
                        </p-button>
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" (click)="editInterview(interview)" />
                        <p-button icon="pi pi-trash" severity="danger" (click)="deleteInterview(interview)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="interviewDialog" header="Interview Details" 
          [style]="{ width: '700px' }" [modal]="true" [closable]="true">
    <div class="p-fluid" style="padding: 20px;">
        
       
        <div class="p-field" style="margin-bottom: 20px;">
            <label for="applicationId" class="p-text-bold" style="display: block; margin-bottom: 5px;">Application ID:</label>
            <input id="applicationId" pInputText [(ngModel)]="interview.applicationId" 
                   required class="p-inputtext p-d-block" [style]="{ width: '100%', height: '40px', padding: '8px' }" />
        </div>
        
      
        <div class="p-field" style="margin-bottom: 20px;">
            <label for="scheduledDateTime" class="p-text-bold" style="display: block; margin-bottom: 5px;">Scheduled Date:</label>
            <p-calendar id="scheduledDateTime" [(ngModel)]="interview.scheduledDateTime" 
                        [showTime]="true" hourFormat="24" dateFormat="yy-mm-dd" showIcon 
                        [minDate]="today" appendTo="body" [style]="{ width: '100%' }" />
        </div>

       
        <div class="p-field" style="margin-bottom: 40px;">  
            <label for="status" class="p-text-bold" style="display: block; margin-bottom: 5px;">Status:</label>
            <p-dropdown id="status" [(ngModel)]="interview.status" 
                        [options]="statuses" optionLabel="label" optionValue="value"
                        placeholder="Select Status" [style]="{ width: '100%' }" />
        </div>

        
        <div class="p-d-flex p-jc-end p-ai-center" style="margin-top: 20px; gap: 10px;">  
            <p-button label="Cancel" icon="pi pi-times" class="p-button-text" 
                      (click)="interviewDialog = false" [style]="{ width: '110px', height: '40px' }" />
            <p-button label="Save" icon="pi pi-check" class="p-button-primary" 
                      (click)="saveInterview()" [style]="{ width: '110px', height: '40px' }" />
        </div>

    </div>
</p-dialog>







        <p-confirmdialog></p-confirmdialog>
    `
})
export class Interviews implements OnInit {
    today: Date = new Date();
    interviewDialog: boolean = false;
    interviews = signal<Interview[]>([]);
    interview: Interview = {
        interviewId: '',
        applicationId: '',
        scheduledDateTime: '', 
        meetingLink: '',
        recordingLink: '',
        status: InterviewStatus.SCHEDULED,
        createdAt: '',  
    };
    
    selectedInterviews!: Interview[] | null;
    submitted: boolean = false;
    statuses = [
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Canceled', value: 'CANCELED' }
    ];
    

    @ViewChild('dt') dt!: TableModule;

    constructor(
        private interviewService: InterviewService,
        private evaluationFormService: EvaluationFormService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadInterviews();
    }

    loadInterviews() {
        this.interviewService.getAllInterviews().subscribe((data) => {
            // Check each interview for existing evaluation
            const interviewsWithEvalStatus = data.map(interview => {
                return this.evaluationFormService.getEvaluationFormByApplicationId(interview.applicationId)
                    .pipe(
                        map(() => ({ ...interview, hasEvaluation: true })),
                        catchError(() => of({ ...interview, hasEvaluation: false }))
                    );
            });

            // Wait for all checks to complete
            forkJoin(interviewsWithEvalStatus).subscribe(interviews => {
                this.interviews.set(interviews);
            });
        });
    }

    openNew() {
        this.interview = {
            
            applicationId: '',
            scheduledDateTime: new Date().toISOString(), 
            meetingLink: '',
            recordingLink: '',
            status: InterviewStatus.SCHEDULED,
            createdAt: new Date().toISOString(),

        };
        this.submitted = false;
        this.interviewDialog = true;
    }

    editInterview(interview: Interview) {
        this.interview = { ...interview };
        this.interviewDialog = true;
    }

    deleteInterview(interview: Interview) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this interview?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.interviewService.deleteInterview(interview.interviewId!).subscribe(() => {
                    this.loadInterviews();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Interview Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    saveInterview() {
        this.submitted = true;

        if (this.interview.applicationId?.trim()) {
            if (this.interview.interviewId) {
                this.interviewService.updateInterview(this.interview.interviewId, this.interview).subscribe(() => {
                    this.loadInterviews();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Interview Updated',
                        life: 3000
                    });
                });
            } else {
                this.interviewService.createInterview(this.interview).subscribe(() => {
                    this.loadInterviews();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Interview Created',
                        life: 3000
                    });
                });
            }
            this.interviewDialog = false;
        }
    }

    navigateToEvaluation(interview: Interview, mode: 'create' | 'view') {
        this.router.navigate(['/uikit/evaluation-form'], {
            queryParams: {
                applicationId: interview.applicationId,
                mode: mode
            }
        });
    }
}
