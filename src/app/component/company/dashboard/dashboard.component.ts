import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CompanyService } from '../../../services/company.service';

// Backend response interface for clarity
interface UserResponse {
  userId?: number;
  id?: number; 
  userName?: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Employee {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CompanyDashboardComponent implements OnInit {
  activeTabIndex: number = 0;
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  employeeDialog: boolean = false;
  deleteEmployeeDialog: boolean = false;
  detailsEmployeeDialog: boolean = false;
  loading: boolean = false;
  employeeForm!: FormGroup;
  submitted: boolean = false;
  
  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.loadEmployees();
    this.initEmployeeForm();
  }
  
  initEmployeeForm(): void {
    this.employeeForm = this.fb.group({
      id: [0],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }
  
  loadEmployees(): void {
    this.loading = true;
    this.companyService.getEmployees().subscribe({
      next: (data: UserResponse[]) => {
        // Map backend User objects to our Employee interface
        this.employees = data.map(user => ({
          id: user.userId || Number(user.id) || 0,
          username: user.userName || user.username || '',
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load employees'
        });
        // Fallback to mock data if API fails
        this.loadMockEmployees();
      }
    });
  }
  
  // Fallback to load mock data if API fails
  loadMockEmployees(): void {
    setTimeout(() => {
      this.employees = [
        {
          id: 1,
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        {
          id: 2,
          username: 'janesmith',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com'
        },
        {
          id: 3,
          username: 'mjohnson',
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@example.com'
        },
        {
          id: 4,
          username: 'swilliams',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@example.com'
        },
        {
          id: 5,
          username: 'rbrown',
          firstName: 'Robert',
          lastName: 'Brown',
          email: 'robert.brown@example.com'
        }
      ];
      this.loading = false;
    }, 500);
  }
  
  openNew(): void {
    this.submitted = false;
    this.employeeForm.reset({
      id: 0
    });
    this.employeeDialog = true;
  }
  
  deleteEmployee(employee: Employee): void {
    this.deleteEmployeeDialog = true;
    this.selectedEmployee = employee;
  }
  
  confirmDelete(): void {
    if (!this.selectedEmployee) return;
    
    this.deleteEmployeeDialog = false;
    this.loading = true;
    
    this.companyService.deleteEmployee(this.selectedEmployee.id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== this.selectedEmployee!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee deleted successfully'
        });
        this.loading = false;
        this.selectedEmployee = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete employee'
        });
        this.loading = false;
        // Keep the employee in list since deletion failed
      }
    });
  }
  
  viewDetails(employee: Employee): void {
    this.selectedEmployee = {...employee};
    this.detailsEmployeeDialog = true;
  }
  
  editEmployee(employee: Employee): void {
    this.submitted = false;
    this.employeeForm.patchValue({...employee});
    this.employeeDialog = true;
  }
  
  hideDialog(): void {
    this.employeeDialog = false;
    this.detailsEmployeeDialog = false;
    this.submitted = false;
  }
  
  saveEmployee(): void {
    this.submitted = true;
    
    if (this.employeeForm.invalid) {
      return;
    }
    
    const employeeData = this.employeeForm.value;
    this.loading = true;
    
    // Use the backend endpoint to add employee
    if (employeeData.id === 0) {
      // Format data to match EmployeeCreationDTO
      const employeeDTO = {
        username: employeeData.username,
        email: employeeData.email,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName
      };
      
      this.companyService.addEmployee(employeeDTO).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Employee added successfully'
          });
          this.loadEmployees(); // Reload employees from server
          this.loading = false;
          this.employeeDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to add employee'
          });
          this.loading = false;
        }
      });
    } else {
      // Update existing employee
      this.companyService.updateEmployee(employeeData.id, employeeData).subscribe({
        next: (response: UserResponse) => {
          // Map the response to match our Employee interface
          const updatedEmployee: Employee = {
            id: response.userId || Number(response.id) || employeeData.id,
            username: response.userName || response.username || employeeData.username,
            email: response.email || employeeData.email,
            firstName: response.firstName || employeeData.firstName,
            lastName: response.lastName || employeeData.lastName
          };
          
          const index = this.employees.findIndex(e => e.id === employeeData.id);
          if (index !== -1) {
            this.employees[index] = updatedEmployee;
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee updated successfully'
          });
          this.loading = false;
          this.employeeDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update employee'
          });
          this.loading = false;
        }
      });
    }
  }
  
  private getNextEmployeeId(): number {
    const maxId = this.employees.reduce((max, employee) => employee.id > max ? employee.id : max, 0);
    return maxId + 1;
  }
  
  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
  }
  
  // Form validation helpers
  get f() { return this.employeeForm.controls; }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }
  
  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `${this.getFieldLabel(fieldName)} must be less than ${maxLength} characters`;
    }
    if (field.hasError('email')) {
      return 'Invalid email format';
    }
    
    return 'Invalid field';
  }
  
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      firstName: 'First name',
      lastName: 'Last name'
    };
    return labels[fieldName] || fieldName;
  }
} 