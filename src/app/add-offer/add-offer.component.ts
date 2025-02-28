// src/app/components/job-offers/job-offers.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobOffer, ContractType, JobLocation, ExperienceLevel } from '../models/job-offer.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JobofferService } from '../Services/joboffer.service';
import { ToolbarModule } from 'primeng/toolbar'; // ✅ Importer ToolbarModule
import { ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
@Component({
    
    selector: 'app-job-offers',
    templateUrl: './add-offer.component.html',
    styleUrls: ['./add-offer.component.scss'], 

    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule,
      HttpClientModule,
      FormsModule,
      TableModule,
      DialogModule,
      DropdownModule,
      ButtonModule,
      ToastModule,
      ConfirmDialogModule,
      ToolbarModule ,
      InputTextModule, 
      RippleModule,     
      TextareaModule    

  ],
})
export class AddOfferComponent implements OnInit {
    jobOfferDialog: boolean = false;
    jobOffers = signal<JobOffer[]>([]);
    jobOffer: JobOffer = {
        id: '',
        title: '',
        description: '',
        contractType: ContractType.FULL_TIME,
        location: JobLocation.REMOTE,
        experienceLevel: ExperienceLevel.JUNIOR,
        requiredSkills: '',
       // enterpriseId: '',
        createdAt: new Date()
    };
    submitted: boolean = false;

    contractTypes = [
        { label: 'Full Time', value: ContractType.FULL_TIME },
        { label: 'Part Time', value: ContractType.PART_TIME },
        { label: 'Internship', value: ContractType.INTERNSHIP },
        { label: 'Freelance', value: ContractType.FREELANCE }
    ];

    jobLocations = [
        { label: 'Remote', value: JobLocation.REMOTE },
        { label: 'On Site', value: JobLocation.ON_SITE },
        { label: 'Hybrid', value: JobLocation.HYBRID }
    ];

    experienceLevels = [
        { label: 'Junior', value: ExperienceLevel.JUNIOR },
        { label: 'Mid Level', value: ExperienceLevel.MID_LEVEL },
        { label: 'Senior', value: ExperienceLevel.SENIOR },
        { label: 'Expert', value: ExperienceLevel.EXPERT }
    ];

    constructor(
        private JobofferService: JobofferService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadJobOffers();
        
    }

    loadJobOffers() {
        this.JobofferService.getAllJobOffers().subscribe({
            next: (data) => this.jobOffers.set(data),
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load job offers',
                    life: 3000
                });
                console.error(err);
            }
        });
    }

    openNew() {
        this.jobOffer = {
            id: '',
            title: '',
            description: '',
            contractType: ContractType.FULL_TIME,
            location: JobLocation.REMOTE,
            experienceLevel: ExperienceLevel.JUNIOR,
            requiredSkills: '',
            //enterpriseId: '',
            createdAt: new Date()
        };
        this.submitted = false;
        this.jobOfferDialog = true;
    }

    editJobOffer(jobOffer: JobOffer) {
        this.jobOffer = { ...jobOffer };
        this.jobOfferDialog = true;
    }

    deleteJobOffer(jobOffer: JobOffer) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this job offer?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.JobofferService.deleteJobOffer(jobOffer.id).subscribe(() => {
                    this.jobOffers.update((offers) =>
                        offers.filter((o) => o.id !== jobOffer.id)
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Job Offer Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    saveJobOffer() {
        this.submitted = true;

        if (
            this.jobOffer.title?.trim() &&
            this.jobOffer.description?.trim() &&
            this.jobOffer.requiredSkills?.trim()
        ) {
            if (this.jobOffer.id) {
                this.JobofferService.updateJobOffer(this.jobOffer.id, this.jobOffer).subscribe((updatedOffer) => {
                    this.jobOffers.update((offers) =>
                        offers.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Job Offer Updated',
                        life: 3000
                    });
                });
            } else {
                this.JobofferService.createJobOffer(this.jobOffer).subscribe((newOffer) => {
                    this.jobOffers.update((offers) => [...offers, newOffer]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Job Offer Created',
                        life: 3000
                    });
                });
            }
            this.jobOfferDialog = false;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields',
                life: 3000
            });
        }
    }
}