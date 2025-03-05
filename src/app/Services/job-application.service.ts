import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:8084/api/jobApp';
  private uploadUrl = 'http://localhost:8084/api/uploads';

  constructor(private http: HttpClient) { }

  submitApplication(jobApplicationDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, jobApplicationDTO)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateJobApplication(id: string, jobApplicationDTO: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, jobApplicationDTO)
      .pipe(
        catchError(this.handleError)
      );
  }

  getJobApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Add view count increment method
  incrementJobOfferViewCount(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/view`)
      .pipe(
        catchError(this.handleError)
      );
  }
  downloadFile(fileName: string, fileType: string): Observable<Blob> {
    return this.http.get(`${this.uploadUrl}/${fileName}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uploadUrl}/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue; veuillez réessayer plus tard.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur côté serveur: Code ${error.status}, ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Utilisez throwError(() => new Error(errorMessage))
  }
}