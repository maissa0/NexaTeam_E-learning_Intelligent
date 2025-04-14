import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h4>Welcome, {{ userProfile?.firstName || userProfile?.userName || 'User' }}!</h4>
          <p>This is your dashboard. Here you can see an overview of your account and activities.</p>
          
          <div class="flex justify-content-end">
            <button pButton label="Register Your Company" icon="pi pi-building" 
                    class="p-button-outlined" routerLink="/company/register"></button>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6 xl:col-3">
        <div class="card">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Users</span>
              <div class="text-900 font-medium text-xl">152</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">24 new </span>
          <span class="text-500">since last visit</span>
        </div>
      </div>
      
      <div class="col-12 md:col-6 xl:col-3">
        <div class="card">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Revenue</span>
              <div class="text-900 font-medium text-xl">$2.100</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-map-marker text-orange-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">%52+ </span>
          <span class="text-500">since last week</span>
        </div>
      </div>
      
      <div class="col-12 md:col-6 xl:col-3">
        <div class="card">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Customers</span>
              <div class="text-900 font-medium text-xl">28441</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-inbox text-cyan-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">520 </span>
          <span class="text-500">newly registered</span>
        </div>
      </div>
      
      <div class="col-12 md:col-6 xl:col-3">
        <div class="card">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Comments</span>
              <div class="text-900 font-medium text-xl">152 Unread</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-comment text-purple-500 text-xl"></i>
            </div>
          </div>
          <span class="text-green-500 font-medium">85 </span>
          <span class="text-500">responded</span>
        </div>
      </div>

      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>Recent Activities</h5>
          <p-table [value]="activities" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-activity>
              <tr>
                <td>{{ activity.description }}</td>
                <td>{{ activity.date }}</td>
                <td>
                  <span [class]="'activity-badge status-' + activity.status.toLowerCase()">
                    {{ activity.status }}
                  </span>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>System Statistics</h5>
          <p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .activity-badge {
        border-radius: 2px;
        padding: .25em .5rem;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: .3px;
      }
      
      .status-success {
        background-color: #C8E6C9;
        color: #256029;
      }
      
      .status-info {
        background-color: #B3E5FC;
        color: #0288D1;
      }
      
      .status-warning {
        background-color: #FFECB3;
        color: #856404;
      }
      
      .status-danger {
        background-color: #FFCDD2;
        color: #C63737;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userProfile: User | null = null;
  
  activities = [
    { description: 'Login', date: '2023-06-15 10:30', status: 'Success' },
    { description: 'Profile Update', date: '2023-06-14 14:45', status: 'Info' },
    { description: 'Password Change', date: '2023-06-12 09:15', status: 'Success' },
    { description: 'Failed Login Attempt', date: '2023-06-10 22:30', status: 'Danger' },
    { description: 'Certificate Upload', date: '2023-06-08 16:20', status: 'Success' },
    { description: '2FA Setup', date: '2023-06-05 11:10', status: 'Info' },
    { description: 'Account Created', date: '2023-06-01 09:00', status: 'Success' }
  ];
  
  chartData: any;
  chartOptions: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
    this.initChart();
  }

  loadUserProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response.user;
      },
      error: (error) => {
        console.error('Failed to load user profile', error);
      }
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Active Users',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'New Registrations',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4
        }
      ]
    };
    
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
} 