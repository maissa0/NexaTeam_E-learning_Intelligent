import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluationForm } from '../models/evaluation-form.model';

@Injectable({
    providedIn: 'root'
})
export class EvaluationFormService {
    private baseUrl = 'http://localhost:8083/api/evaluationForms';

    constructor(private http: HttpClient) { }

    createEvaluationForm(evaluationForm: EvaluationForm): Observable<EvaluationForm> {
        return this.http.post<EvaluationForm>(`${this.baseUrl}/create`, evaluationForm);
    }

    getEvaluationFormById(id: string): Observable<EvaluationForm> {
        return this.http.get<EvaluationForm>(`${this.baseUrl}/getbyId/${id}`);
    }

    getAllEvaluationForms(): Observable<EvaluationForm[]> {
        return this.http.get<EvaluationForm[]>(`${this.baseUrl}/getAll`);
    }

    updateEvaluationForm(id: string, evaluationForm: EvaluationForm): Observable<EvaluationForm> {
        return this.http.put<EvaluationForm>(`${this.baseUrl}/update/${id}`, evaluationForm);
    }

    deleteEvaluationForm(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
    }

    getEvaluationFormByApplicationId(applicationId: string): Observable<EvaluationForm> {
        return this.http.get<EvaluationForm>(`${this.baseUrl}/getByApplicationId/${applicationId}`);
    }
} 