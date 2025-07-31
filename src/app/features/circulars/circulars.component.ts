import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CircularService } from '../../core/services/circular.service';
import { Circular, CircularStatus, Priority } from '../../core/models/circular.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-circulars',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid p-4">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Regulatory Circulars</h1>
          <p class="text-muted mb-0">Manage and track regulatory compliance documents</p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary">
              <i class="fas fa-filter me-2"></i>
              Filter
            </button>
            <a routerLink="/circulars/upload" class="btn btn-primary">
              <i class="fas fa-upload me-2"></i>
              Upload Circular
            </a>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <label class="form-label fw-semibold text-muted small">Regulatory Body</label>
              <select class="form-select">
                <option value="">All Regulatory Bodies</option>
                <option value="RBI">Reserve Bank of India (RBI)</option>
                <option value="SEBI">Securities and Exchange Board (SEBI)</option>
                <option value="IRDAI">Insurance Regulatory Authority (IRDAI)</option>
                <option value="NABARD">National Bank for Agriculture (NABARD)</option>
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="form-label fw-semibold text-muted small">Status</label>
              <select class="form-select">
                <option value="">All Status</option>
                <option value="RECEIVED">Received</option>
                <option value="PROCESSING">Processing</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="form-label fw-semibold text-muted small">Priority</label>
              <select class="form-select">
                <option value="">All Priorities</option>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical Priority</option>
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="form-label fw-semibold text-muted small">Search</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input type="search" class="form-control" placeholder="Search circulars...">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Circulars List -->
      <div class="row" *ngIf="circulars$ | async as circulars">
        <div class="col-12" *ngFor="let circular of circulars">
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-primary-subtle text-primary rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <h5 class="mb-0 fw-semibold">
                          <a [routerLink]="['/circulars', circular.id]" class="text-decoration-none">
                            {{ circular.title }}
                          </a>
                        </h5>
                        <span class="badge" [ngClass]="getStatusBadgeClass(circular.status)">
                          {{ circular.status }}
                        </span>
                        <span class="badge" [ngClass]="getPriorityBadgeClass(circular.priority)">
                          {{ circular.priority }}
                        </span>
                      </div>
                      <p class="text-muted mb-0">{{ circular.description }}</p>
                    </div>
                  </div>
                  
                  <div class="row g-3 mb-3">
                    <div class="col-md-3">
                      <div class="p-3 bg-primary-subtle border border-primary-subtle rounded">
                        <label class="form-label fw-semibold text-muted small mb-1">Reference Number</label>
                        <div class="fw-semibold">{{ circular.referenceNumber }}</div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="p-3 bg-info-subtle border border-info-subtle rounded">
                        <label class="form-label fw-semibold text-muted small mb-1">Regulatory Body</label>
                        <div class="fw-semibold">
                          <i class="fas fa-university text-info me-2"></i>
                          {{ circular.regulatoryBody }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="p-3 bg-success-subtle border border-success-subtle rounded">
                        <label class="form-label fw-semibold text-muted small mb-1">Issued Date</label>
                        <div class="fw-semibold">
                          <i class="fas fa-calendar text-success me-2"></i>
                          {{ circular.issuedDate | date:'dd MMM yyyy' }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="p-3 bg-warning-subtle border border-warning-subtle rounded">
                        <label class="form-label fw-semibold text-muted small mb-1">Effective Date</label>
                        <div class="fw-semibold">
                          <i class="fas fa-clock text-warning me-2"></i>
                          {{ circular.effectiveDate | date:'dd MMM yyyy' }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex gap-2">
                      <span class="badge bg-light text-dark border">
                        <i class="fas fa-tag me-1"></i>
                        {{ circular.category }}
                      </span>
                      <span class="badge bg-light text-dark border" *ngIf="circular.attachments?.length">
                        <i class="fas fa-paperclip me-1"></i>
                        {{ circular.attachments.length }} Attachments
                      </span>
                    </div>
                    
                    <div class="btn-group">
                      <a [routerLink]="['/circulars', circular.id]" class="btn btn-sm btn-outline-primary" title="View Details">
                        <i class="fas fa-eye"></i>
                      </a>
                      <button class="btn btn-sm btn-outline-info" title="Assign Tasks" (click)="assignTasks(circular.id)">
                        <i class="fas fa-users"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" (click)="editCircular(circular.id)"><i class="fas fa-edit me-2"></i>Edit</a></li>
                          <li><a class="dropdown-item" href="#" (click)="downloadCircular(circular.id)"><i class="fas fa-download me-2"></i>Download</a></li>
                          <li><a class="dropdown-item" href="#" (click)="shareCircular(circular.id)"><i class="fas fa-share me-2"></i>Share</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" (click)="deleteCircular(circular.id)"><i class="fas fa-trash me-2"></i>Delete</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="text-center py-5" *ngIf="(circulars$ | async)?.length === 0">
        <div class="p-5 bg-light rounded border-2 border-dashed">
          <i class="fas fa-file-alt fa-4x text-muted mb-3"></i>
          <h4 class="text-muted">No circulars found</h4>
          <p class="text-muted">Upload your first regulatory circular to get started</p>
          <a routerLink="/circulars/upload" class="btn btn-primary">
            <i class="fas fa-upload me-2"></i>
            Upload Circular
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      max-width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class CircularsComponent implements OnInit {
  circulars$: Observable<Circular[]>;

  constructor(private circularService: CircularService) {
    this.circulars$ = this.circularService.getCirculars().pipe(
      map(response => response.data)
    );
  }

  ngOnInit(): void {}

  getStatusBadgeClass(status: CircularStatus): string {
    const classes = {
      [CircularStatus.RECEIVED]: 'bg-info text-white',
      [CircularStatus.PROCESSING]: 'bg-warning text-white',
      [CircularStatus.ASSIGNED]: 'bg-primary text-white',
      [CircularStatus.IN_PROGRESS]: 'bg-info text-white',
      [CircularStatus.COMPLETED]: 'bg-success text-white',
      [CircularStatus.OVERDUE]: 'bg-danger text-white'
    };
    return classes[status] || 'bg-secondary text-white';
  }

  getPriorityBadgeClass(priority: Priority): string {
    const classes = {
      [Priority.LOW]: 'bg-success-subtle text-success-emphasis border border-success-subtle',
      [Priority.MEDIUM]: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
      [Priority.HIGH]: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
      [Priority.CRITICAL]: 'bg-dark text-white'
    };
    return classes[priority] || 'bg-secondary text-white';
  }

  processWithAI(circularId: string) {
    console.log('Processing circular with AI:', circularId);
    // Implement AI processing logic
  }

  assignTasks(circularId: string) {
    console.log('Assigning tasks for circular:', circularId);
    // Implement task assignment logic
  }

  editCircular(circularId: string) {
    console.log('Editing circular:', circularId);
    // Navigate to edit form or open modal
  }

  downloadCircular(circularId: string) {
    console.log('Downloading circular:', circularId);
    // Implement download logic
  }

  shareCircular(circularId: string) {
    console.log('Sharing circular:', circularId);
    // Implement share logic
  }

  deleteCircular(circularId: string) {
    if (confirm('Are you sure you want to delete this circular?')) {
      console.log('Deleting circular:', circularId);
      // Implement delete logic
    }
  }
}