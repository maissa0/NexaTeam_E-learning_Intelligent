import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:8084/api/jobApp';

  constructor(private http: HttpClient) { }

  submitApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData, {
      headers: new HttpHeaders({
        'Accept': '*/*'
      }),
      reportProgress: true
    });
  }

  getAllApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  downloadFile(fileName: string, fileType: string): Observable<Blob> {
    const endpoint = fileType === 'resume' ? 'download-resume' : 'download-cover-letter';
    return this.http.get(`${this.apiUrl}/${endpoint}/${fileName}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    });
  }

  downloadCoverLetter(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cover-letter/${fileName}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    });
  }
}
