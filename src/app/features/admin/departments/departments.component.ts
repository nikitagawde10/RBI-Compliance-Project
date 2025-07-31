import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { UserService } from '../../../core/services/user.service';
import { Department } from '../../../core/models/user.model';
import { CreateDepartmentRequest } from '../../../core/models/api.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="departments-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-2">Department Management</h1>
          <p class="text-muted mb-0">Manage organizational departments and structure</p>
        </div>
        <button class="btn btn-primary" (click)="openAddDepartmentModal()">
          <i class="fas fa-plus me-2"></i>
          Add Department
        </button>
      </div>
      
      <!-- Departments Grid -->
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" *ngFor="let department of departments$ | async">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="bg-primary-subtle text-primary rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
                  <i class="fas fa-building"></i>
                </div>
                <div>
                  <h5 class="mb-1 fw-semibold">{{ department.name }}</h5>
                  <small class="text-muted">{{ department.code }}</small>
                </div>
              </div>
              <p class="text-muted mb-3">{{ department.description || 'No description available' }}</p>
              <div class="row g-2 mb-3">
                <div class="col-6">
                  <div class="text-center p-2 bg-primary-subtle rounded">
                    <div class="fw-bold text-primary">{{ department.memberCount || 0 }}</div>
                    <small class="text-muted">Members</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-center p-2 bg-success-subtle rounded">
                    <div class="fw-bold text-success">{{ department.activeTasks || 0 }}</div>
                    <small class="text-muted">Active Tasks</small>
                  </div>
                </div>
              </div>
              <div class="mb-3" *ngIf="department.headId">
                <small class="text-muted">Department Head:</small>
                <div class="fw-semibold">{{ getDepartmentHeadName(department.headId) }}</div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary flex-fill" (click)="editDepartment(department)">
                  <i class="fas fa-edit me-1"></i>
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-info" (click)="viewDepartmentMembers(department.id)" title="View Members">
                  <i class="fas fa-users"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Department Modal -->
    <div class="modal fade" id="departmentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-building text-primary me-2"></i>
              {{ editingDepartment ? 'Edit Department' : 'Add New Department' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="departmentForm" (ngSubmit)="saveDepartment()">
              <div class="mb-3">
                <label class="form-label fw-semibold">Department Name *</label>
                <input type="text" class="form-control" formControlName="name" placeholder="Enter department name"
                       [class.is-invalid]="departmentForm.get('name')?.invalid && departmentForm.get('name')?.touched">
                <div class="invalid-feedback">Department name is required</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Department Code *</label>
                <input type="text" class="form-control" formControlName="code" placeholder="Enter department code (e.g., TECH)"
                       [class.is-invalid]="departmentForm.get('code')?.invalid && departmentForm.get('code')?.touched">
                <div class="invalid-feedback">Department code is required</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Description</label>
                <textarea class="form-control" rows="3" formControlName="description" placeholder="Enter department description"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Department Head</label>
                <select class="form-select" formControlName="headId">
                  <option value="">Select Department Head</option>
                  <option *ngFor="let user of users$ | async" [value]="user.id">
                    {{ user.firstName }} {{ user.lastName }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Parent Department</label>
                <select class="form-select" formControlName="parentId">
                  <option value="">None (Top Level)</option>
                  <option *ngFor="let dept of departments$ | async" [value]="dept.id" 
                          [disabled]="editingDepartment && dept.id === editingDepartment.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveDepartment()" [disabled]="departmentForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!isSubmitting" class="fas fa-save me-2"></i>
              {{ editingDepartment ? 'Update Department' : 'Create Department' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .departments-container {
      padding: 2rem;
    }
  `]
})
export class DepartmentsComponent implements OnInit {
  departmentForm: FormGroup;
  editingDepartment: Department | null = null;
  isSubmitting = false;

  private refreshSubject = new BehaviorSubject<void>(undefined);
  departments$: Observable<Department[]>;
  users$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private userService: UserService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: [''],
      headId: [''],
      parentId: ['']
    });

    this.departments$ = this.refreshSubject.pipe(
      switchMap(() => this.departmentService.getDepartments()),
      map(response => response.data || [])
    );

    this.users$ = this.userService.getUsers().pipe(
      map(response => response.data || [])
    );
  }

  ngOnInit(): void {}

  openAddDepartmentModal() {
    this.editingDepartment = null;
    this.departmentForm.reset();
    const modal = new (window as any).bootstrap.Modal(document.getElementById('departmentModal'));
    modal.show();
  }

  editDepartment(department: Department) {
    this.editingDepartment = department;
    this.departmentForm.patchValue({
      name: department.name,
      code: department.code,
      description: department.description,
      headId: department.headId,
      parentId: department.parentId
    });
    const modal = new (window as any).bootstrap.Modal(document.getElementById('departmentModal'));
    modal.show();
  }

  saveDepartment() {
    if (this.departmentForm.valid) {
      this.isSubmitting = true;
      const departmentData = this.departmentForm.value;

      const operation = this.editingDepartment
        ? this.departmentService.updateDepartment(this.editingDepartment.id, departmentData)
        : this.departmentService.createDepartment(departmentData as CreateDepartmentRequest);

      operation.subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('departmentModal'));
            modal.hide();
            this.refreshSubject.next(); // Refresh list
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error saving department:', error);
        }
      });
    }
  }

  manageDepartment(departmentId: string) {
    console.log('Managing department:', departmentId);
    // Navigate to department management page or open modal
  }


  getDepartmentHeadName(headId: string): string {
    // This would typically be resolved through the API or a separate service
    return 'Department Head'; // Placeholder
  }

  viewDepartmentMembers(departmentId: string) {
    console.log('Viewing members for department:', departmentId);
    // TODO: Implement navigation to department members view or open modal
  }
}