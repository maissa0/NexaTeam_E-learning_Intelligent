import { Component, OnInit, signal } from '@angular/core';
import { OffersService } from '../Services/offers.service';
import { MessageService } from 'primeng/api';
import { JobOffer } from '../models/job-offer.model';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, DialogModule, AccordionModule, ButtonModule, ToastModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [MessageService],
})
export class OffersComponent implements OnInit {
  jobOffers = signal<JobOffer[]>([]); // Liste des offres d'emploi
  isLoading = signal(false); // Indicateur de chargement
  displayJobDetails = false; // Contrôle l'affichage du dialog
  selectedJobDetails: JobOffer | null = null; // Détails de l'offre sélectionnée

  constructor(
    private offersService: OffersService, // Injectez OffersService
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  // Charger les offres d'emploi depuis le backend
  loadJobOffers() {
    this.isLoading.set(true);
    this.offersService.getOffers().subscribe({
      next: (data) => {
        this.jobOffers.set(data); // Mettre à jour la liste des offres
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job offers',
          life: 3000,
        });
        console.error('Error loading job offers:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Ouvrir le dialog avec les détails de l'offre
  openJobDetails(offerId: string) {
    this.isLoading.set(true);
    this.offersService.getOfferDetails(offerId).subscribe({
      next: (data) => {
        this.selectedJobDetails = data; // Stocker les détails complets de l'offre
        this.displayJobDetails = true;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job details',
          life: 3000,
        });
        console.error('Error loading job details:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Fermer le dialog
  closeJobDetails() {
    this.selectedJobDetails = null; // Réinitialiser les détails de l'offre
    this.displayJobDetails = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Dialog Closed',
      detail: 'The job details dialog has been closed.',
      life: 3000,
    });
  }
}