import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class OffersService {
  private BASE_URL = 'http://localhost:8084/api/job-offers';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les offres d'emploi
  getOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.BASE_URL}`).pipe(
      map(offers => {
        console.log('Raw offers data:', offers);
        return offers;
      }),
      catchError(this.handleError)
    );
  }

  // Récupérer les détails complets d'une offre d'emploi par son ID
  getOfferDetails(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.BASE_URL}/getbyID/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  incrementJobOfferViewCount(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}/view`)
      .pipe(
        catchError((error: any) => {
          console.error('Error incrementing view count:', error);
          return throwError(() => error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => errorMessage);
  }
}