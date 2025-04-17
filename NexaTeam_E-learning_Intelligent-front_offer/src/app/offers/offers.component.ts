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
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    AccordionModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    InputTextModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [MessageService],
})
export class OffersComponent implements OnInit {
  jobOffers = signal<JobOffer[]>([]);
  isLoading = signal(false);
  displayJobDetails = false;
  selectedJobDetails: JobOffer | null = null;
  searchText: string = '';
  fullDescriptionDialog: boolean = false;
  selectedOffer: JobOffer | null = null;

  constructor(
    private offersService: OffersService,
    private favoriteService: FavoriteService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  loadJobOffers() {
    this.isLoading.set(true);
    this.offersService.getOffers().subscribe({
      next: (data) => {
        this.jobOffers.set(data);
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

  openJobDetails(offerId: string) {
    this.isLoading.set(true);
    this.offersService.getOfferDetails(offerId).subscribe({
      next: (data) => {
        this.selectedJobDetails = data;
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

  closeJobDetails() {
    this.selectedJobDetails = null;
    this.displayJobDetails = false;
  }

  onToggleFavorite(offer: JobOffer) {
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8';
    
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

  navigateToFavorites() {
    this.router.navigate(['/favoris']);
  }

  navigateToApplicationForm() {
    this.router.navigate(['/job-application-form']);
  }

  filterOffers() {
    const filteredOffers = this.jobOffers().filter(offer => {
      if (!this.searchText) return true;
      
      const searchTerm = this.searchText.toLowerCase();
      const titleMatch = offer.title?.toLowerCase().includes(searchTerm);
      const skillsMatch = Array.isArray(offer.requiredSkills) && 
        offer.requiredSkills.some((skill: string) => 
          skill.toLowerCase().includes(searchTerm)
        );

      return titleMatch || skillsMatch;
    });

    if (filteredOffers.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Aucun résultat',
        detail: 'Aucune offre ne correspond à votre recherche.'
      });
    }

    this.jobOffers.set(filteredOffers);
  }

  getDescriptionPreview(description: string | undefined): string {
    if (!description) return '';
    return description.length > 150 ? description.slice(0, 150) + '...' : description;
  }

  hasLongDescription(description: string | undefined): boolean {
    return description ? description.length > 150 : false;
  }

  viewFullDescription(offer: JobOffer) {
    this.selectedOffer = offer;
    this.fullDescriptionDialog = true;
  }
}


