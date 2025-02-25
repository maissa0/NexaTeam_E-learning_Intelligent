import { Component, OnInit, signal } from '@angular/core';
import { OffersService } from '../Services/offers.service';
import { MessageService } from 'primeng/api'; // Importez MessageService
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast'; // Importez ToastModule
import { offer } from '../models/offer.model'; // Importez votre modèle

@Component({
  selector: 'app-offers',
  standalone: true, // Déclarez ce composant comme standalone
  imports: [CommonModule, ToastModule], // Importez ToastModule ici
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'], // Vérifiez ce chemin
  providers: [MessageService] // Fournissez MessageService ici
})
export class OffersComponent implements OnInit {
  jobOffers = signal<offer[]>([]); // Utilisation de `signal` pour un état réactif
  isLoading = signal(false); // Indicateur de chargement

  constructor(
    private OffersService: OffersService,
    private messageService: MessageService // Injectez MessageService
  ) {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  async loadJobOffers() {
    this.isLoading.set(true); // Début du chargement

    try {
      const data = await this.OffersService.getOffers().toPromise();
      this.jobOffers.set(data || []); // Mettre à jour les offres avec les données reçues
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load job offers',
        life: 3000
      });
      console.error('Error loading job offers:', err);
    } finally {
      this.isLoading.set(false); // Fin du chargement
    }
  }
}