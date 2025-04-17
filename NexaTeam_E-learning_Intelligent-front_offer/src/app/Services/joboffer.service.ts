// src/app/services/job-offer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { JobOffer } from '../models/job-offer.model';
import { ContractType } from '../models/job-offer.model';
import { JobLocation } from '../models/job-offer.model';
import { ExperienceLevel } from '../models/job-offer.model';

export interface JobOfferSearchDTO {
    keyword?: string;
    contractType?: ContractType | string;
    location?: JobLocation | string;
    experienceLevel?: ExperienceLevel | string;
}

// Interface pour les données envoyées à l'API pour la génération de description
interface GenerateDescriptionDTO {
    jobTitle: string;
    requiredSkills: string;
    contractType: string;
    location: string;
    experienceLevel: string;
}

// Interface pour la réponse de l'API de génération de description
interface GenerateDescriptionResponse {
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class JobofferService {
    private BASE_URL = 'http://localhost:8084/api/job-offers';

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

    // Rechercher des offres d'emploi
    searchJobOffers(searchDTO: JobOfferSearchDTO): Observable<JobOffer[]> {
        return this.http.post<JobOffer[]>(`${this.BASE_URL}/search`, searchDTO);
    }

    // Increment and get view count for a job offer
    viewJobOfferDetails(id: string): Observable<JobOffer> {
        return this.http.get<JobOffer>(`${this.BASE_URL}/${id}/view`);
    }

    /**
     * Génère une description d'offre d'emploi en utilisant l'IA
     */
    generateDescription(data: GenerateDescriptionDTO): Observable<GenerateDescriptionResponse> {
        const url = `${this.BASE_URL}/generate-description`;
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            }),
            responseType: 'text' as 'json'  // Force le type de réponse en texte
        };

        console.log('Envoi de la requête de génération avec les données:', data);
        
        return this.http.post(url, data, httpOptions).pipe(
            map((response: any) => {
                // Si la réponse est une chaîne de caractères, on la transforme en objet
                if (typeof response === 'string') {
                    return { description: response };
                }
                return response;
            }),
            tap(response => {
                console.log('Réponse reçue du serveur:', response);
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Erreur détaillée:', {
                    status: error.status,
                    statusText: error.statusText,
                    error: error.error,
                    message: error.message
                });
                
                if (error.status === 0) {
                    return throwError(() => new Error('Impossible de joindre le serveur. Vérifiez votre connexion.'));
                }
                
                const errorMessage = error.error?.message || error.message || 'Une erreur est survenue';
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}