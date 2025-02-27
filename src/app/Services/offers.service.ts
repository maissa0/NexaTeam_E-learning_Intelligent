import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class OffersService {
  private BASE_URL = 'http://localhost:8084/api/offersDisponibles'; // URL de base de l'API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres d'emploi
  getOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.BASE_URL);
  }

  // Récupérer les détails complets d'une offre d'emploi par son ID
  getOfferDetails(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.BASE_URL}/${id}`);
  }
}