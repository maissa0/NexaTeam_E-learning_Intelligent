import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../Services/favorite.service';
import { OffersService } from '../../Services/offers.service';
import { JobOffer } from '../../models/job-offer.model';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, DialogModule, AccordionModule, ButtonModule, ToastModule],
  template: `
    <div class="favorites-container">
      <header class="page-header">
        <h1>My Favorite Job Offers</h1>
      </header>

      <div *ngIf="isLoading()" class="loading-spinner">
        <div class="spinner">
          <div class="spinner-inner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
          </div>
        </div>
      </div>

      <div class="job-cards-container" *ngIf="!isLoading()">
        <div *ngIf="favoriteOffers().length === 0" class="no-offers-message">
          <div class="p-message p-message-info w-full">
            <div class="p-message-text">
              <i class="pi pi-info-circle"></i>
              No favorite job offers yet.
            </div>
          </div>
        </div>

        <div class="grid">
          <div *ngFor="let offer of favoriteOffers()" class="col-12 md:col-6 lg:col-4">
            <div class="job-card">
              <div class="card-header">
                <button class="favorite-button" (click)="onToggleFavorite(offer)">
                  <i class="pi pi-heart-fill"></i>
                </button>
              </div>

              <div class="card-content">
                <h3 class="job-title">{{ offer.title }}</h3>
                
                <div class="job-details">
                  <span class="location">
                    <i class="pi pi-map-marker"></i>
                    {{ offer.location }}
                  </span>
                  <span class="contract-type">
                    <i class="pi pi-briefcase"></i>
                    {{ offer.contractType }}
                  </span>
                </div>

                <div class="card-footer">
                  <span class="posted-date">
                    <i class="pi pi-calendar"></i>
                    Posted {{ offer.createdAt | date:'dd/MM/yyyy' }}
                  </span>
                  <p-button 
                    label="View Details" 
                    (click)="openJobDetails(offer.id)"
                    styleClass="p-button-rounded p-button-info">
                  </p-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p-dialog [header]="selectedJobDetails?.title" [(visible)]="displayJobDetails" [modal]="true"
      [style]="{width: '50vw'}" [breakpoints]="{'960px': '75vw'}" [draggable]="false" [resizable]="false">
      <p-accordion>
        <p-accordion-panel value="0">
          <p-accordion-header>
            <i class="pi pi-file"></i>
            Job Description
          </p-accordion-header>
          <p-accordion-content>
            <p class="m-0">
              {{ selectedJobDetails?.description || 'No description available.' }}
            </p>
          </p-accordion-content>
        </p-accordion-panel>

        <p-accordion-panel value="1">
          <p-accordion-header>
            <i class="pi pi-list"></i>
            Requirements
          </p-accordion-header>
          <p-accordion-content>
            <p class="m-0">
              <strong>Required Skills:</strong> {{ selectedJobDetails?.requiredSkills || 'No specific requirements.' }}
            </p>
          </p-accordion-content>
        </p-accordion-panel>

        <p-accordion-panel value="2">
          <p-accordion-header>
            <i class="pi pi-info-circle"></i>
            Additional Information
          </p-accordion-header>
          <p-accordion-content>
            <div class="info-grid">
              <div class="info-item">
                <i class="pi pi-briefcase"></i>
                <strong>Contract Type:</strong> {{ selectedJobDetails?.contractType }}
              </div>
              <div class="info-item">
                <i class="pi pi-map-marker"></i>
                <strong>Location:</strong> {{ selectedJobDetails?.location }}
              </div>
              <div class="info-item">
                <i class="pi pi-user"></i>
                <strong>Experience Level:</strong> {{ selectedJobDetails?.experienceLevel }}
              </div>
              <div class="info-item">
                <i class="pi pi-calendar"></i>
                <strong>Posted Date:</strong> {{ selectedJobDetails?.createdAt | date: 'dd/MM/yyyy' }}
              </div>
            </div>
          </p-accordion-content>
        </p-accordion-panel>
      </p-accordion>
      
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button label="Apply" icon="pi pi-send" styleClass="p-button-success mr-2"></p-button>
          <p-button label="Close" icon="pi pi-times" styleClass="p-button-secondary" (click)="closeJobDetails()"></p-button>
        </div>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
    .favorites-container {
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .job-cards-container {
      margin-top: 2rem;
    }

    .job-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: transform 0.2s;
    }

    .job-card:hover {
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: flex-end;
    }

    .favorite-button {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .job-title {
      margin: 1rem 0;
      color: #2c3e50;
    }

    .job-details {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .location, .contract-type {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #7f8c8d;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .posted-date {
      color: #95a5a6;
      font-size: 0.9rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `],
  providers: [MessageService]
})
export class FavoritesComponent implements OnInit {
  favoriteOffers = signal<JobOffer[]>([]);
  isLoading = signal(false);
  displayJobDetails = false;
  selectedJobDetails: JobOffer | null = null;

  constructor(
    private favoriteService: FavoriteService,
    private offersService: OffersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteOffers();
  }

  loadFavoriteOffers() {
    this.isLoading.set(true);
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8'; // Replace with actual user ID
    
    this.favoriteService.getFavorites(userId).subscribe({
      next: (favoriteIds: string[]) => {
        // Fetch details for each favorite offer
        const offers: JobOffer[] = [];
        favoriteIds.forEach((id: string) => {
          this.offersService.getOfferDetails(id).subscribe({
            next: (offer) => {
              offer.isFavorite = true;
              offers.push(offer);
              if (offers.length === favoriteIds.length) {
                this.favoriteOffers.set(offers);
                this.isLoading.set(false);
              }
            },
            error: (err) => {
              console.error('Error loading offer details:', err);
              this.isLoading.set(false);
            }
          });
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load favorite offers',
          life: 3000,
        });
        console.error('Error loading favorite offers:', err);
        this.isLoading.set(false);
      }
    });
  }

  onToggleFavorite(offer: JobOffer) {
    const userId = '65f1c2e8a1b2c3d4e5f6a7b8'; // Replace with actual user ID
    
    this.favoriteService.removeFromFavorites(userId, offer.id).subscribe({
      next: () => {
        this.favoriteOffers.set(this.favoriteOffers().filter(o => o.id !== offer.id));
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
} 