import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import { CompanyService } from '../../services/company.service';
import { User, Role, Company } from '../../models/user.model';
import { CompanyRegistrationRequest, RequestStatus } from '../../models/company.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface TeacherRequest {
  id: number;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt?: string;
  approvalReason?: string;
  rejectionReason?: string;
}

interface CompanyEmployee {
  userId: number;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CardModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialogModule,
    TabViewModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Data arrays
  companyRequests: CompanyRegistrationRequest[] = [];
  teacherRequests: TeacherRequest[] = [];
  companies: Company[] = [];
  teachers: User[] = [];
  allUsers: User[] = [];
  companyEmployees: CompanyEmployee[] = [];
  
  // UI state
  isLoading = false;
  displayCompanyDialog = false;
  displayTeacherDialog = false;
  displayEmployeesDialog = false;
  displayActionDialog = false;
  selectedCompany: CompanyRegistrationRequest | null = null;
  selectedTeacher: TeacherRequest | null = null;
  actionReason = '';
  actionDialogTitle = '';
  actionDialogIcon = '';
  actionDialogButtonClass = '';
  actionType: 'approve' | 'reject' | null = null;
  isAdmin = false;

  constructor(
    private adminService: AdminService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user has admin role
    this.authService.getDetailedUserProfile().subscribe({
      next: (response: any) => {
        console.log('User profile:', response);
        if (response?.role === 'ROLE_ADMIN') {
          this.isAdmin = true;
          this.loadData();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to access this page'
          });
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        console.error('Error getting user profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Authentication Error',
          detail: 'Please log in to access this page'
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  loadData(): void {
    if (!this.isAdmin) {
      return;
    }
    
    this.isLoading = true;
    
    // Load company requests from the API
    this.adminService.getCompanyRequests().subscribe({
      next: (data) => {
        this.companyRequests = data;
        this.loadCompanies();
      },
      error: (error) => {
        this.handleError('Failed to load company requests', error);
        this.loadCompanies();
      }
    });
    
    // Mock teacher requests for now
    this.teacherRequests = this.getMockTeacherRequests();
    
    // Load teachers and all users
    this.loadAllUsers();
  }
  
  loadCompanies(): void {
    this.isLoading = true;
    this.adminService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Failed to load companies', error);
        // Fallback to mock data if API call fails
        this.companies = this.getMockCompanies();
        this.isLoading = false;
      }
    });
  }

  loadTeachers(): void {
    // Filter users with ROLE_TEACHER from allUsers
    this.teachers = this.allUsers.filter((user: User) => 
      user.role && user.role.roleName === 'ROLE_TEACHER'
    );
  }

  loadAllUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.loadTeachers(); // Load teachers after users are loaded
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Failed to load users', error);
        // Fallback to mock data if API call fails
        this.allUsers = this.getMockUsers();
        this.loadTeachers();
        this.isLoading = false;
      }
    });
  }

  // UI Helper methods
  onGlobalFilter(event: Event, table: any): void {
    if (event.target) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warn';
      case 'REJECTED': return 'danger';
      default: return 'info';
    }
  }

  // Error handling
  handleError(message: string, error: any): void {
    this.isLoading = false;
    console.error(error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  // Mock data for demo
  getMockTeacherRequests(): TeacherRequest[] {
    return [
      {
        id: 1,
        userName: 'teacher1',
        email: 'teacher1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userName: 'teacher2',
        email: 'teacher2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        approvalReason: 'Qualified credentials'
      }
    ];
  }
  
  getMockCompanyRequests(): any[] {
    return [
      {
        id: 1,
        name: 'ABC Corporation',
        emailCompany: 'info@abccorp.com',
        address: '123 Business Ave, Suite 100',
        logo: 'assets/layout/images/logo-dark.svg',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'XYZ Industries',
        emailCompany: 'contact@xyzindustries.com',
        address: '456 Commerce St',
        logo: 'assets/layout/images/logo-dark.svg',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
  
  getMockCompanies(): Company[] {
    return [
      {
        id: 1,
        name: 'ABC Corporation',
        emailCompany: 'info@abccorp.com',
        address: '123 Business Ave, Suite 100',
        logo: 'assets/layout/images/logo-dark.svg',
        description: 'Leading provider of business solutions'
      },
      {
        id: 2,
        name: 'XYZ Industries',
        emailCompany: 'contact@xyzindustries.com',
        address: '456 Commerce St',
        logo: 'assets/layout/images/logo-dark.svg',
        description: 'Manufacturing excellence since 2000'
      }
    ];
  }
  
  getMockCompanyEmployees(): CompanyEmployee[] {
    return [
      {
        userId: 1,
        userName: 'employee1',
        email: 'employee1@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: { roleId: 2, roleName: 'ROLE_EMPLOYEE' }
      },
      {
        userId: 2,
        userName: 'employee2',
        email: 'employee2@example.com',
        firstName: 'Bob',
        lastName: 'Williams',
        role: { roleId: 2, roleName: 'ROLE_EMPLOYEE' }
      }
    ];
  }

  // Company request actions
  viewCompanyDetails(company: any): void {
    this.selectedCompany = company;
    this.displayCompanyDialog = true;
  }

  approveCompanyRequest(company: any): void {
    this.selectedCompany = company;
    this.actionType = 'approve';
    this.actionDialogTitle = 'Approve Company Request';
    this.actionDialogIcon = 'pi pi-check-circle';
    this.actionDialogButtonClass = 'p-button-success';
    this.actionReason = '';
    this.displayActionDialog = true;
  }
  
  confirmApproveCompany(): void {
    this.isLoading = true;
    this.displayActionDialog = false;
    
    this.adminService.approveCompanyRequest(this.selectedCompany!.id!, this.actionReason).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company request approved successfully'
        });
        this.loadData(); // Reload all data
      },
      error: (error) => {
        this.handleError('Failed to approve company request', error);
      }
    });
  }

  rejectCompanyRequest(company: any): void {
    this.selectedCompany = company;
    this.actionType = 'reject';
    this.actionDialogTitle = 'Reject Company Request';
    this.actionDialogIcon = 'pi pi-times-circle';
    this.actionDialogButtonClass = 'p-button-danger';
    this.actionReason = '';
    this.displayActionDialog = true;
  }
  
  confirmRejectCompany(): void {
    this.isLoading = true;
    this.displayActionDialog = false;
    
    this.adminService.rejectCompanyRequest(this.selectedCompany!.id!, this.actionReason).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company request rejected successfully'
        });
        this.loadData(); // Reload all data
      },
      error: (error) => {
        this.handleError('Failed to reject company request', error);
      }
    });
  }
  
  // Action dialog submit
  onActionDialogSubmit(): void {
    if (this.actionType === 'approve') {
      this.confirmApproveCompany();
    } else if (this.actionType === 'reject') {
      this.confirmRejectCompany();
    }
  }

  // Company employees
  viewCompanyEmployees(company: any): void {
    this.selectedCompany = company;
    this.isLoading = true;
    
    this.adminService.getCompanyEmployees(company.id).subscribe({
      next: (data) => {
        this.companyEmployees = data;
        this.isLoading = false;
        this.displayEmployeesDialog = true;
      },
      error: (error) => {
        this.handleError('Failed to load company employees', error);
        // Fallback to mock data if API call fails
        this.companyEmployees = this.getMockCompanyEmployees();
        this.isLoading = false;
        this.displayEmployeesDialog = true;
      }
    });
  }
  
  // User details
  viewUserDetails(user: any): void {
    // Implementation will be added
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: `Viewing details for user: ${user.userName}`
    });
  }

  // Teacher request actions
  viewTeacherDetails(teacher: TeacherRequest): void {
    this.selectedTeacher = teacher;
    this.displayTeacherDialog = true;
  }

  approveTeacherRequest(teacher: TeacherRequest): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this teacher request?',
      header: 'Confirm Approval',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        // Mock API call
        setTimeout(() => {
          teacher.status = 'APPROVED';
          teacher.updatedAt = new Date().toISOString();
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Teacher request approved successfully'
          });
        }, 500);
      }
    });
  }

  rejectTeacherRequest(teacher: TeacherRequest): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject this teacher request?',
      header: 'Confirm Rejection',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        // Mock API call
        setTimeout(() => {
          teacher.status = 'REJECTED';
          teacher.updatedAt = new Date().toISOString();
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Teacher request rejected successfully'
          });
        }, 500);
      }
    });
  }

  // User status toggle
  toggleUserStatus(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${user.enabled ? 'disable' : 'enable'} this user account?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        // In a real application, you would call a service like:
        // this.adminService.updateAccountEnabledStatus(user.userId, !user.enabled).subscribe({...})
        setTimeout(() => {
          user.enabled = !user.enabled;
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User account ${user.enabled ? 'enabled' : 'disabled'} successfully`
          });
        }, 500);
      }
    });
  }

  // Add mock users data
  getMockUsers(): User[] {
    return [
      {
        userId: 1,
        userName: 'admin',
        email: 'admin@example.com',
        firstName: 'System',
        lastName: 'Administrator',
        enabled: true,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true,
        isTwoFactorEnabled: true,
        role: { roleId: 1, roleName: 'ROLE_ADMIN' },
        createdDate: new Date(Date.now() - 10000000).toISOString()
      },
      {
        userId: 2,
        userName: 'teacher1',
        email: 'teacher1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        enabled: true,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true,
        isTwoFactorEnabled: false,
        role: { roleId: 3, roleName: 'ROLE_TEACHER' },
        createdDate: new Date(Date.now() - 5000000).toISOString()
      },
      {
        userId: 3,
        userName: 'employee1',
        email: 'employee1@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        enabled: true,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true,
        isTwoFactorEnabled: false,
        role: { roleId: 2, roleName: 'ROLE_EMPLOYEE' },
        createdDate: new Date(Date.now() - 3000000).toISOString()
      },
      {
        userId: 4,
        userName: 'teacher2',
        email: 'teacher2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        enabled: false,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true,
        isTwoFactorEnabled: false,
        role: { roleId: 3, roleName: 'ROLE_TEACHER' },
        createdDate: new Date(Date.now() - 2000000).toISOString()
      },
      {
        userId: 5,
        userName: 'user1',
        email: 'user1@example.com',
        firstName: 'Robert',
        lastName: 'Brown',
        enabled: true,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true,
        isTwoFactorEnabled: false,
        role: { roleId: 4, roleName: 'ROLE_USER' },
        createdDate: new Date(Date.now() - 1000000).toISOString()
      }
    ];
  }
} 