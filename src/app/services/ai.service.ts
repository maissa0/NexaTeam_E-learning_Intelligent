import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AiResponse {
  content?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/api/ai/public`;

  constructor(private http: HttpClient) { }

  /**
   * Generate a professional summary based on job title and skills
   * @param jobTitle The job title
   * @param skills Array of skills
   * @returns An Observable containing the generated summary text
   */
  generateSummary(jobTitle: string, skills: string[]): Observable<string> {
    return this.http.post<AiResponse>(`${this.apiUrl}/generate-summary`, {
      jobTitle, 
      skills
    }).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.content || '';
      })
    );
  }

  /**
   * Enhance a job description to make it more professional
   * @param jobTitle The job title
   * @param company The company name
   * @param description The original description
   * @returns An Observable containing the enhanced description
   */
  enhanceDescription(jobTitle: string, company: string, description: string): Observable<string> {
    return this.http.post<AiResponse>(`${this.apiUrl}/enhance-description`, {
      jobTitle,
      company,
      description
    }).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.content || '';
      })
    );
  }

  /**
   * Get AI-suggested skills for a specific job title
   * @param jobTitle The job title to get suggestions for
   * @returns An Observable containing a comma-separated list of skills
   */
  suggestSkills(jobTitle: string): Observable<string> {
    return this.http.get<AiResponse>(`${this.apiUrl}/suggest-skills`, {
      params: { jobTitle }
    }).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.content || '';
      })
    );
  }
} 