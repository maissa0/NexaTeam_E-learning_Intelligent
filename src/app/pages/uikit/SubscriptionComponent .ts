import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Subscription } from '../Models/Subsc';
import { SubscriptionServiceService } from '../service/subscription-service.service';

@Component({
    selector: 'app-messages-demo',
    standalone: true,
    imports: [CommonModule, ToastModule, ButtonModule, InputTextModule,  FormsModule,ReactiveFormsModule],
    template: `
    <div class="container py-5">
  <!-- Subscription Form -->
  <div class="card shadow-sm mb-5">
    <div class="card-header bg-gradient bg-success text-white">
      <h5 class="mb-0"><i class="bi bi-plus-circle me-2"></i>{{ editingId ? 'Edit' : 'Create' }} Subscription</h5>
    </div>
    <div class="card-body">
      <form [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
        <div class="row g-4 mb-3">
          <div class="col-md-6">
            <label class="form-label">Plan Name</label>
            <input formControlName="planName" type="text" class="form-control" placeholder="e.g. Premium Plan">
          </div>
          <div class="col-md-6">
            <label class="form-label">Price</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input formControlName="price" type="number" class="form-control" placeholder="Enter price (e.g. 19.99)">
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea formControlName="description" class="form-control" rows="3" placeholder="Short summary of what this plan includes..."></textarea>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <label class="form-label">Status</label>
            <select formControlName="status" class="form-select">
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Expiry Date</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar-date"></i></span>
              <input formControlName="expiryDate" type="date" class="form-control">
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-success px-4" type="submit">
            <i class="bi bi-save me-1"></i> {{ editingId ? 'Update' : 'Create' }}
          </button>
          <button class="btn btn-outline-secondary px-4" type="button" (click)="resetForm()">
            <i class="bi bi-arrow-repeat me-1"></i> Reset
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="card shadow-sm">
  <div class="card-header bg-light d-flex justify-content-between align-items-center">
    <h5 class="mb-0"><i class="bi bi-table me-2"></i>All Subscriptions</h5>
  </div>
  <div class="card-body p-0">
    <table class="table table-bordered table-hover align-middle text-center mb-0">
      <thead class="table-success text-dark">
        <tr>
          <th>Plan</th>
          <th>Description</th>
          <th>Price</th>
          <th>Status</th>
          <th>Expiry Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of subscriptions">
          <td>{{ s.planName }}</td>
          <td class="text-start">{{ s.description }}</td>
          <td>{{ s.price | currency }}</td>
          <td>
            <span class="badge rounded-pill px-3" [ngClass]="s.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'">
              {{ s.status }}
            </span>
          </td>
          <td>{{ s.expiryDate | date: 'mediumDate' }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(s)">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" *ngIf="s.id" (click)="delete(s.id)">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
        <tr *ngIf="subscriptions.length === 0">
          <td colspan="6" class="text-muted fst-italic text-center">No subscriptions available.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


  `,
  
  styles: `
 .container {
  max-width: 960px;
}

.card {
  border-radius: 0.75rem;
  border: none;
}

.card-header {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem;
  background-color: #f8f9fa;
}

.card-body {
  padding: 0.5rem;
}

.input-group-text {
  background-color: #e9f7ef;
  border-color: #c3e6cb;
}

textarea {
  resize: none;
}

.btn {
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.8em;
}

.table td, .table th {
  vertical-align: middle;
  font-size: 0.95rem;
}

.table th {
  background-color: #f1f1f1;
  font-weight: 600;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table td {
  word-wrap: break-word;
}

.table-bordered {
  border: 1px solid #ddd;
}

.table-bordered th, .table-bordered td {
  border-color: #ddd;
}

/* Small button styling */
.btn-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

/* Add margin for actions column */
.table td:last-child {
  padding-right: 0.5rem;
}

  `,
  
    providers: [SubscriptionServiceService]
})
export class SubscriptionComponent implements OnInit {
    subscriptions: Subscription[] = [];
  subscriptionForm: FormGroup;
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private subService: SubscriptionServiceService) {
    this.subscriptionForm = this.fb.group({
      planName: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      status: ['ACTIVE', Validators.required],
      expiryDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subService.getAll().subscribe((data: Subscription[]) => {
      console.log(data); // Check if 'id' is available in the response
      this.subscriptions = data;
    });
  }

  onSubmit() {
    const subscription: Subscription = this.subscriptionForm.value;
    if (this.editingId) {
      this.subService.update(this.editingId, subscription).subscribe(() => {
        this.resetForm();
        this.loadSubscriptions();
      });
    } else {
      this.subService.create(subscription).subscribe(() => {
        this.resetForm();
        this.loadSubscriptions();
      });
    }
  }

  edit(subscription: Subscription) {
    this.subscriptionForm.patchValue(subscription);
    this.editingId = subscription.id!;
  }

  delete(id: number) {
    console.log('Deleting subscription with id:', id);  // Check if id is correctly passed
    if (id !== undefined) {
      this.subService.delete(id).subscribe(() => this.loadSubscriptions());
    } else {
      console.error('Invalid ID:', id);
    }
  }
  

  resetForm() {
    this.subscriptionForm.reset({ status: 'ACTIVE' });
    this.editingId = null;
  }
}
