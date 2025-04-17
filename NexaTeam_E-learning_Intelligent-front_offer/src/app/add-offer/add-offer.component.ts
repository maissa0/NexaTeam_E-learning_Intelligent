// src/app/components/job-offers/job-offers.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobOffer, ContractType, JobLocation, ExperienceLevel } from '../models/job-offer.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JobofferService, JobOfferSearchDTO } from '../Services/joboffer.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { InputTextarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-job-offers',
    templateUrl: './add-offer.component.html',
    styleUrls: ['./add-offer.component.scss'],
    standalone: true,
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
        ToolbarModule,
        InputTextModule,
        RippleModule,
        TextareaModule,
        ReactiveFormsModule,
        RatingModule,
        RadioButtonModule,
        InputNumberModule,
        TagModule,
        InputTextarea,
        TooltipModule,
        ChartModule,
        CardModule
    ],
})
export class AddOfferComponent implements OnInit {
    jobOfferDialog: boolean = false;
    jobOffers = signal<JobOffer[]>([]);
    jobOffer: JobOffer = {
        id: '',
        title: '',
        company: '',
        description: '',
        contractType: ContractType.FULL_TIME,
        location: JobLocation.REMOTE,
        department: '',
        experienceLevel: ExperienceLevel.JUNIOR,
        requiredSkills: '',
        createdAt: new Date(),
        status: 'ACTIVE',
        viewCount: 0,
        isFavorite: false
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
    searchCriteria = {
        keyword: '',
        contractType: null as ContractType | null,
        location: null as JobLocation | null,
        experienceLevel: null as ExperienceLevel | null
    };
    searchResults: JobOffer[] = [];

    isGeneratingDescription = false;

    fullDescriptionDialog: boolean = false;
    selectedOffer: JobOffer | null = null;

    contractTypeData: any;
    contractTypeOptions: any;

    constructor(
        private router: Router,
        private JobofferService: JobofferService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadJobOffers();
        this.setupContractTypeChart();
    }

    searchCriteriaForm = {
        keyword: '',
        contractType: null as ContractType | null,
        location: null as JobLocation | null,
        experienceLevel: null as ExperienceLevel | null
    };

    searchOffers(): void {
        const searchParams: JobOfferSearchDTO = {
            keyword: this.searchCriteria.keyword,
            contractType: this.searchCriteria.contractType?.toString(),
            location: this.searchCriteria.location?.toString(),
            experienceLevel: this.searchCriteria.experienceLevel?.toString()
        };
    
        if (Object.values(searchParams).some(value => value)) {
            this.JobofferService.searchJobOffers(searchParams).subscribe({
                next: (results) => {
                    this.searchResults = results;
                    this.jobOffers.set(results);
                    if (results.length === 0) {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Search Results',
                            detail: 'No matching job offers found',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error searching job offers:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to search job offers',
                        life: 3000
                    });
                }
            });
        } else {
            this.loadJobOffers();
        }
    }

    setupContractTypeChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.contractTypeData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Full Time',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Part Time',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Internship',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#FFC107',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Freelance',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#FF5722',
                    backgroundColor: 'rgba(255, 87, 34, 0.2)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };

        this.contractTypeOptions = {
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        font: {
                            size: 11,
                            weight: 'bold'
                        },
                        color: textColor,
                        usePointStyle: true,
                        padding: 15,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 12,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 11
                    },
                    padding: 8,
                    cornerRadius: 4
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            size: 10
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            },
            animation: {
                duration: 600
            },
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    radius: 2,
                    hoverRadius: 4
                },
                line: {
                    tension: 0.4,
                    borderWidth: 2
                }
            }
        };
    }

    updateContractTypeStats(offers: JobOffer[]) {
        // Créer un objet pour stocker les compteurs par mois
        const monthlyStats = {
            'Full Time': new Array(6).fill(0),
            'Part Time': new Array(6).fill(0),
            'Internship': new Array(6).fill(0),
            'Freelance': new Array(6).fill(0)
        };

        // Compter les offres par type et par mois
        offers.forEach(offer => {
            const date = new Date(offer.createdAt);
            const monthIndex = date.getMonth();
            if (monthIndex < 6) { // Ne compter que les 6 premiers mois
                switch (offer.contractType) {
                    case ContractType.FULL_TIME:
                        monthlyStats['Full Time'][monthIndex]++;
                        break;
                    case ContractType.PART_TIME:
                        monthlyStats['Part Time'][monthIndex]++;
                        break;
                    case ContractType.INTERNSHIP:
                        monthlyStats['Internship'][monthIndex]++;
                        break;
                    case ContractType.FREELANCE:
                        monthlyStats['Freelance'][monthIndex]++;
                        break;
                }
            }
        });

        // Mettre à jour les données du graphique
        this.contractTypeData.datasets[0].data = monthlyStats['Full Time'];
        this.contractTypeData.datasets[1].data = monthlyStats['Part Time'];
        this.contractTypeData.datasets[2].data = monthlyStats['Internship'];
        this.contractTypeData.datasets[3].data = monthlyStats['Freelance'];
    }

    loadJobOffers() {
        this.JobofferService.getAllJobOffers().subscribe({
            next: (data) => {
                this.jobOffers.set(data);
                this.updateContractTypeStats(data);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load job offers',
                    life: 3000
                });
            }
        });
    }

    openNew() {
        this.jobOffer = {
            id: '',
            title: '',
            company: '',
            description: '',
            contractType: ContractType.FULL_TIME,
            location: JobLocation.REMOTE,
            department: '',
            experienceLevel: ExperienceLevel.JUNIOR,
            requiredSkills: '',
            createdAt: new Date(),
            status: 'ACTIVE',
            viewCount: 0,
            isFavorite: false
        };
        this.submitted = false;
        this.jobOfferDialog = true;
        
        setTimeout(() => {
            const titleInput = document.getElementById('job-title');
            if (titleInput) {
                titleInput.focus();
            }
        }, 100);
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
    
    viewApplicants(offerId: number) {
        this.router.navigate(['/application'], { 
            queryParams: { 
                offerId: offerId 
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
                this.JobofferService.updateJobOffer(this.jobOffer.id, this.jobOffer).subscribe({
                    next: (updatedOffer) => {
                        this.jobOffers.update((offers) =>
                            offers.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
                        );
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Job Offer Updated',
                            life: 3000
                        });
                        this.jobOfferDialog = false;
                    },
                    error: (error) => {
                        console.error('Error updating job offer:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update job offer',
                            life: 3000
                        });
                    }
                });
            } else {
                this.JobofferService.createJobOffer(this.jobOffer).subscribe({
                    next: (newOffer) => {
                        this.jobOffers.update((offers) => [...offers, newOffer]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Job Offer Created',
                            life: 3000
                        });
                        this.jobOfferDialog = false;
                    },
                    error: (error) => {
                        console.error('Error creating job offer:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create job offer',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    generateDescription(): void {
        if (!this.jobOffer.title || this.jobOffer.title.length < 3) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Le titre du poste doit contenir au moins 3 caractères'
            });
            return;
        }

        if (!this.jobOffer.requiredSkills || this.jobOffer.requiredSkills.trim().length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez saisir au moins une compétence requise'
            });
            return;
        }

        this.isGeneratingDescription = true;

        const generateData = {
            jobTitle: this.jobOffer.title.trim(),
            requiredSkills: this.jobOffer.requiredSkills.trim(),
            contractType: this.jobOffer.contractType,
            location: this.jobOffer.location,
            experienceLevel: this.jobOffer.experienceLevel
        };

        console.log('Données envoyées pour la génération:', {
            titre: generateData.jobTitle,
            competences: generateData.requiredSkills,
            type: generateData.contractType,
            lieu: generateData.location,
            experience: generateData.experienceLevel
        });

        this.JobofferService.generateDescription(generateData)
            .subscribe({
                next: (response) => {
                    console.log('Réponse reçue du serveur:', response);
                    if (response && response.description) {
                        this.jobOffer.description = response.description;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Description générée avec succès'
                        });
                    } else {
                        console.error('Réponse invalide:', response);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Format de réponse invalide'
                        });
                    }
                },
                error: (error) => {
                    console.error('Erreur lors de la génération:', error);
                    let errorMessage = 'Une erreur est survenue lors de la génération de la description';
                    
                    if (error.status === 0) {
                        errorMessage = 'Impossible de joindre le serveur. Vérifiez que le backend est en cours d\'exécution.';
                    } else if (error.status === 400) {
                        errorMessage = 'Les données fournies sont invalides. Vérifiez le format des champs.';
                    } else if (error.status === 500) {
                        errorMessage = 'Erreur serveur lors de la génération de la description.';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage
                    });
                },
                complete: () => {
                    this.isGeneratingDescription = false;
                }
            });
    }

    viewFullDescription(offer: JobOffer) {
        this.selectedOffer = offer;
        this.fullDescriptionDialog = true;
    }

    getActiveOffers(): number {
        return this.jobOffers().filter(offer => offer.status === 'ACTIVE').length;
    }

    getThisMonthOffers(): number {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.jobOffers().filter(offer => {
            const offerDate = new Date(offer.createdAt);
            return offerDate >= startOfMonth;
        }).length;
    }
}