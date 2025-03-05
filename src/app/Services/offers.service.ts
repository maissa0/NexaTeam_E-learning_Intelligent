import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class OffersService {
  private BASE_URL = 'http://localhost:8084/api/offersDisponibles'; // URL de base de l'API
private apiUrl = '"http://localhost:8084/api/job-offers")';
  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres d'emploi
  getOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.BASE_URL);
  }

  // Récupérer les détails complets d'une offre d'emploi par son ID
  getOfferDetails(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.BASE_URL}/${id}`);
  }
  incrementJobOfferViewCount(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/view`)
      .pipe(
        catchError((error: any) => {
          console.error('Error incrementing view count:', error);
          return throwError(() => error);
        })
      );
  }
}