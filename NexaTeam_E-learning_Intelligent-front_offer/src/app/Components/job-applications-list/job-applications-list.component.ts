import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplicationService } from '../../Services/job-application.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class JobApplicationsListComponent implements OnInit {
  applications: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private jobApplicationService: JobApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.jobApplicationService.getAllApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load applications';
        this.loading = false;
        console.error('Error loading applications:', error);
      }
    });
  }

  getStatusClass(status: string | null): string {
    if (!status) return 'status-pending';

    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  viewFile(fileUrl: string): void {
    if (!fileUrl) {
      this.error = 'No file available';
      return;
    }

    this.error = ''; // Réinitialiser le message d'erreur
    
    this.jobApplicationService.downloadFile(fileUrl).subscribe({
      next: (blob: Blob) => {
        // Créer une URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Ouvrir le PDF directement dans un nouvel onglet
        window.open(url, '_blank');
        
        // Nettoyer l'URL après un délai pour s'assurer que le fichier est chargé
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.error = 'Impossible d\'ouvrir le fichier. Veuillez réessayer plus tard.';
      }
    });
  }
}