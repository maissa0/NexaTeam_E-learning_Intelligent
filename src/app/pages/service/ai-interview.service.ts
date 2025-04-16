import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOfferRequest, QuestionResponse } from '../models/job-offer-request.model';

@Injectable({
    providedIn: 'root'
})
export class AiInterviewService {
    private baseUrl = 'http://localhost:8083/api/interview-questions';

    constructor(private http: HttpClient) { }

    generateQuestions(request: JobOfferRequest): Observable<QuestionResponse[]> {
        return this.http.post<QuestionResponse[]>(this.baseUrl, request);
    }
} 