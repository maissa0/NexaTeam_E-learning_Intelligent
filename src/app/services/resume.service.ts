import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Education {
  id?: number;
  name: string;
  address?: string;
  qualification: string;
  year: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  address?: string;
  startDate: string;
  endDate?: string;
  summary: string;
}

export interface Skill {
  id?: number;
  name: string;
  level: string;
}

export interface Resume {
  id?: number;
  userEmail: string;
  title: string;
  name: string;
  job: string;
  address?: string;
  phone: string;
  email: string;
  themeColor?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface ResumeDTO {
  id?: number;
  userId?: number;
  title: string;
  name: string;
  job: string;
  address?: string;
  phone: string;
  email: string;
  themeColor?: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/api/resumes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Create a new resume
   * @param resume The resume data to create
   * @returns An Observable with the created resume
   */
  createResume(resume: Resume): Observable<Resume> {
    return this.http.post<Resume>(this.apiUrl, resume);
  }

  /**
   * Get a resume by ID
   * @param id The resume ID
   * @returns An Observable with the resume data
   */
  getResume(id: number): Observable<Resume> {
    return this.http.get<Resume>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all resumes for a user
   * @param userId The user's ID
   * @returns An Observable with a list of resumes
   */
  getUserResumes(userId: number): Observable<Resume[]> {
    return this.http.get<Resume[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Get all resumes for the currently authenticated user
   * @returns An Observable with a list of resumes with complete details
   */
  getMyResumes(): Observable<Resume[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Resume[]>(`${this.apiUrl}/my-resumes`, { headers });
  }

  /**
   * Update an existing resume
   * @param id The resume ID
   * @param resume The updated resume data
   * @returns An Observable with the updated resume
   */
  updateResume(id: number, resume: Resume): Observable<Resume> {
    return this.http.put<Resume>(`${this.apiUrl}/${id}`, resume);
  }

  /**
   * Delete a resume
   * @param id The resume ID to delete
   * @returns An Observable with the response
   */
  deleteResume(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Generate a PDF from a resume
   * @param id The resume ID
   * @returns An Observable with the PDF as a Blob
   */
  generatePDF(id: number): Observable<Blob> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob',
      headers
    });
  }

  /**
   * Create a new resume with all its components using the DTO approach
   * @param resume The complete resume data to create
   * @returns An Observable with the created resume and all its components
   */
  createResumeFromDTO(resume: ResumeDTO): Observable<Resume> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Resume>(`${this.apiUrl}/from-dto`, resume, { headers });
  }
}