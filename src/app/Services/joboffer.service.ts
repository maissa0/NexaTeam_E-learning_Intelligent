// src/app/services/job-offer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
    providedIn: 'root' // ✅ Fourni au niveau racine pour une utilisation globale
})
export class JobofferService {
    private BASE_URL = 'http://localhost:8084/api/job-offers'; // ✅ URL de base de l'API

    constructor(private http: HttpClient) {}

    // Récupérer toutes les offres d'emploi
    getAllJobOffers(): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.BASE_URL}`);
    }
   
    // Récupérer une offre d'emploi par son ID
    getJobOfferById(id: string): Observable<JobOffer> {
        return this.http.get<JobOffer>(`${this.BASE_URL}/${id}`);
    }

    // Ajouter une nouvelle offre d'emploi
    createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
        return this.http.post<JobOffer>(`${this.BASE_URL}/addOffer`, jobOffer);
    }

    // Mettre à jour une offre d'emploi existante
    updateJobOffer(id: string, jobOffer: JobOffer): Observable<JobOffer> {
        return this.http.put<JobOffer>(`${this.BASE_URL}/update/${id}`, jobOffer);
    }

    // Supprimer une offre d'emploi
    deleteJobOffer(id: string): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/Delete/${id}`);
    }
}