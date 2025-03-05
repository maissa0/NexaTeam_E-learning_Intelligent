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
    if (!status) return 'status-pending'; // Default status class if status is null

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
  downloadFile(fileName: string, fileType: string): void {
    this.jobApplicationService.downloadFile(fileName, fileType).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        alert('Failed to download file. Please try again.');
      }
    });
  }
  viewFile(fileUrl: string): string {
    if (!fileUrl) return '';
    
    // Remove any 'file:///' prefix if present
    fileUrl = fileUrl.replace('file:///', '');
    
    // Extract just the filename from the path
    const fileName = fileUrl.split('\\').pop()?.split('/').pop();
    
    // Construct the proper API URL
    return `${environment.apiUrl}/api/files/download/${fileName}`;
  }
}