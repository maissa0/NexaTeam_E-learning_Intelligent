import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';
import { offer } from '../models/offer.model';


@Injectable({
    providedIn: 'root' // ✅ Fourni au niveau racine pour une utilisation globale
})

export class OffersService {
  private BASE_URL = 'http://localhost:8084/api/offersDisponibles'; // ✅ URL de base de l'API
  constructor(private http: HttpClient) {}

  getOffers(): Observable<offer[]> {
    return this.http.get<offer[]>(`${this.BASE_URL}`);
}
}
