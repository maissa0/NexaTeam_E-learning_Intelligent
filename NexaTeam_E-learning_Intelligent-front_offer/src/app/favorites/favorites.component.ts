import { FavoriteService } from '../Services/favorite.service';
import { Component, OnInit, signal } from '@angular/core';
import { OffersService } from '../Services/offers.service';
import { MessageService } from 'primeng/api';
import { JobOffer } from '../models/job-offer.model';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DialogModule,
    AccordionModule,
    ToastModule
  ]
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading = true;
  displayJobDetails = false;
  selectedJobDetails: any = null;

  constructor(
    private favoriteService: FavoriteService,
    private messageService: MessageService,
    private router: Router
  ) {}

  // Méthode générique de navigation
  navigateTo(route: string) {
    this.router.navigate([route]).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Navigation',
        detail: 'Redirection en cours...',
        life: 3000
      });
    }).catch(error => {
      console.error('Navigation error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec de la redirection',
        life: 3000
      });
    });
  }

  applyForJob() {
    this.displayJobDetails = false;
    this.navigateTo('Application');
  }

  navigateToOffers() {
    this.navigateTo('JobOffers');
  }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8';
    this.isLoading = true;
    this.favoriteService.getFavorites(userId).subscribe({
      next: (favs) => {
        console.log('Loaded favorites:', favs); // Debug log
        this.favorites = favs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load favorites'
        });
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(jobId: string) {
    console.log('Removing favorite with jobId:', jobId); // Debug log
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8';
    this.favoriteService.removeFromFavorites(userId, jobId).subscribe({
      next: () => {
        console.log('Successfully removed favorite'); // Debug log
        this.favorites = this.favorites.filter(fav => fav.jobOfferId !== jobId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Removed from favorites'
        });
        this.loadFavorites(); // Recharger la liste après la suppression
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove from favorites'
        });
      }
    });
  }

  // Ouvrir le dialog avec les détails de l'offre
  openJobDetails(offerId: string) {
    this.isLoading = true;
    this.favoriteService.getOfferDetails(offerId).subscribe({
        
      next: (data: any) => {
        this.selectedJobDetails = data; // Stocker les détails complets de l'offre
        this.displayJobDetails = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job details',
          life: 3000,
        });
        console.error('Error loading job details:', err);
        this.isLoading = false;
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
