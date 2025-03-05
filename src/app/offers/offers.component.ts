import { Component, OnInit, signal } from '@angular/core';
import { OffersService } from '../Services/offers.service';
import { MessageService } from 'primeng/api';
import { JobOffer } from '../models/job-offer.model';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../Services/favorite.service';

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
    private favoriteService: FavoriteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }
  // In your component where you need to check favorite status
  checkFavoriteStatus(jobOfferId: string) {
    const userId = 'current-user-id'; // Replace with actual user ID
    this.favoriteService.isFavorite(userId, jobOfferId).subscribe({
      next: (isFavorite) => {
        // Update your UI based on isFavorite status
        const offer = this.jobOffers().find(o => o.id === jobOfferId);
        if (offer) {
          offer.isFavorite = isFavorite;
        }
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
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
  onToggleFavorite(offer: JobOffer) {
    // Make sure you have the actual user ID from your auth service
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8'; // Replace this with actual user ID
    
    if (!offer || !offer.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid job offer'
      });
      return;
    }

    if (offer.isFavorite) {
      this.favoriteService.removeFromFavorites(userId, offer.id).subscribe({
        next: () => {
          offer.isFavorite = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Removed from favorites'
          });
        },
        error: (error) => {
          console.error('Error removing favorite:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove from favorites'
          });
        }
      });
    } else {
      this.favoriteService.addToFavorites(userId, offer.id).subscribe({
        next: () => {
          offer.isFavorite = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Added to favorites'
          });
        },
        error: (error) => {
          console.error('Error adding favorite:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add to favorites'
          });
        }
      });
    }
  }
}