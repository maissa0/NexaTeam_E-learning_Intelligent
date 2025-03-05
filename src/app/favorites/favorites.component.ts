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
import { Router } from '@angular/router';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  providers: [MessageService], // Add this line
  imports: [
    CommonModule,
    DialogModule,
    AccordionModule,
    ButtonModule,
    ToastModule,
  ]
})
export class FavoritesComponent {
  favorites: any[] = [];
  isLoading = true;
  displayJobDetails = false;
  selectedJobDetails: any = null;
  constructor(
    private favoriteService: FavoriteService,
    private messageService: MessageService,
    private router: Router  // Add this line
  ) {}
  // Add this method
  // Update the applyForJob method
  applyForJob(jobId: string) {
    if (!jobId) {
      console.log('Job ID:', jobId); // Debug log
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Job ID not found'
      });
      return;
    }
    
    // Try simpler navigation path
    this.router.navigate(['/job-application-form'], {
      queryParams: { jobId: jobId }
    });
    
    // Close the dialog
    this.displayJobDetails = false;
  }
  ngOnInit() {
    this.loadFavorites();
  }
  loadFavorites() {
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8'; // Replace with actual user ID
    this.isLoading = true;
    this.favoriteService.getFavorites(userId).subscribe({
      next: (favs) => {
        this.favorites = favs;
        this.isLoading = false;
      },
      error: (error) => {
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
    const userId = 'current-user-id'; // Replace with actual user ID
    this.favoriteService.removeFromFavorites(userId, jobId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(fav => fav.jobOfferId !== jobId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Removed from favorites'
        });
      },
      error: (error) => {
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