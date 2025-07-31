import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { DepartmentService } from '../../../core/services/department.service';
import { User } from '../../../core/models/user.model';
import { CreateUserRequest, FilterParams } from '../../../core/models/api.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="users-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-2">User Management</h1>
          <p class="text-muted mb-0">Manage system users and their permissions</p>
        </div>
        <button class="btn btn-primary" (click)="openAddUserModal()">
          <i class="fas fa-plus me-2"></i>
          Add User
        </button>
      </div>
      
      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <form [formGroup]="filterForm">
            <div class="row g-3">
              <div class="col-md-3">
                <select class="form-select" formControlName="role">
                  <option value="">All Roles</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                  <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                  <option value="DEPARTMENT_HEAD">Department Head</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" formControlName="department">
                  <option value="">All Departments</option>
                  <option *ngFor="let dept of departments$ | async" [value]="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" formControlName="status">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-md-3">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input type="search" class="form-control" placeholder="Search users..." formControlName="search">
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-users text-primary me-2"></i>
            System Users
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users$ | async">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                      </div>
                      <div>
                        <h6 class="mb-1 fw-semibold">{{ user.firstName }} {{ user.lastName }}</h6>
                        <small class="text-muted">{{ user.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getRoleBadgeClass(user.role)">{{ user.role }}</span>
                  </td>
                  <td>{{ user.department.name || 'N/A' }}</td>
                  <td>
                    <span class="badge" [ngClass]="user.isActive ? 'bg-success text-white' : 'bg-danger text-white'">
                      <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div *ngIf="user.lastLogin">
                      <div class="fw-medium">{{ user.lastLogin | date:'dd MMM yyyy' }}</div>
                      <small class="text-muted">{{ user.lastLogin | date:'HH:mm' }}</small>
                    </div>
                    <span *ngIf="!user.lastLogin" class="text-muted">Never</span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" title="Edit User" (click)="editUser(user)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-info" title="View Profile" (click)="viewProfile(user.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-warning" title="Reset Password" (click)="resetPassword(user.id)">
                        <i class="fas fa-key"></i>
                      </button>
                      <button 
                        class="btn" 
                        [ngClass]="user.isActive ? 'btn-outline-danger' : 'btn-outline-success'"
                        [title]="user.isActive ? 'Deactivate' : 'Activate'" 
                        (click)="toggleUserStatus(user)">
                        <i class="fas" [ngClass]="user.isActive ? 'fa-user-slash' : 'fa-user-check'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user-plus text-primary me-2"></i>
              {{ editingUser ? 'Edit User' : 'Add New User' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="userForm" (ngSubmit)="saveUser()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">First Name *</label>
                  <input type="text" class="form-control" formControlName="firstName" 
                         [class.is-invalid]="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched">
                  <div class="invalid-feedback">First name is required</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Last Name *</label>
                  <input type="text" class="form-control" formControlName="lastName"
                         [class.is-invalid]="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched">
                  <div class="invalid-feedback">Last name is required</div>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Email Address *</label>
                  <input type="email" class="form-control" formControlName="email"
                         [class.is-invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                  <div class="invalid-feedback">Valid email is required</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Role *</label>
                  <select class="form-select" formControlName="role"
                          [class.is-invalid]="userForm.get('role')?.invalid && userForm.get('role')?.touched">
                    <option value="">Select Role</option>
                    <option value="SYSTEM_ADMIN">System Admin</option>
                    <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                    <option value="DEPARTMENT_HEAD">Department Head</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
                  <div class="invalid-feedback">Role is required</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Department *</label>
                  <select class="form-select" formControlName="departmentId"
                          [class.is-invalid]="userForm.get('departmentId')?.invalid && userForm.get('departmentId')?.touched">
                    <option value="">Select Department</option>
                    <option *ngFor="let dept of departments$ | async" [value]="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">Department is required</div>
                </div>
                <div class="col-12" *ngIf="!editingUser">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="sendWelcomeEmail" formControlName="sendWelcomeEmail">
                    <label class="form-check-label" for="sendWelcomeEmail">
                      Send welcome email with login credentials
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveUser()" [disabled]="userForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!isSubmitting" class="fas fa-save me-2"></i>
              {{ editingUser ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 2rem;
    }
  `]
})
export class UsersComponent implements OnInit {
  filterForm: FormGroup;
  userForm: FormGroup;
  editingUser: User | null = null;
  isSubmitting = false;

  private filtersSubject = new BehaviorSubject<FilterParams>({});
  users$: Observable<User[]>;
  departments$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService
  ) {
    this.filterForm = this.fb.group({
      role: [''],
      department: [''],
      status: [''],
      search: ['']
    });

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      sendWelcomeEmail: [true]
    });

    this.users$ = this.filtersSubject.pipe(
      switchMap(filters => this.userService.getUsers(filters)),
      map(response => response.data || [])
    );

    this.departments$ = this.departmentService.getDepartments().pipe(
      map(response => response.data || [])
    );
  }

  ngOnInit(): void {
    // Watch for filter changes
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value)
    ).subscribe(filters => {
      const cleanFilters: FilterParams = {};
      
      if (filters.search) cleanFilters.search = filters.search;
      if (filters.role) cleanFilters.role = [filters.role];
      if (filters.department) cleanFilters.department = [filters.department];
      if (filters.status) {
        cleanFilters.status = filters.status === 'active' ? ['ACTIVE'] : ['INACTIVE'];
      }

      this.filtersSubject.next(cleanFilters);
    });
  }

  openAddUserModal() {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.patchValue({ sendWelcomeEmail: true });
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  }

  editUser(user: User) {
    this.editingUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      departmentId: user.department?.id
    });
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  }

  saveUser() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = this.userForm.value;

      const operation = this.editingUser 
        ? this.userService.updateUser(this.editingUser.id, userData)
        : this.userService.createUser(userData as CreateUserRequest);

      operation.subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('userModal'));
            modal.hide();
            this.filtersSubject.next(this.filtersSubject.value); // Refresh list
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error saving user:', error);
        }
      });
    }
  }

  viewProfile(userId: string) {
    console.log('Viewing profile:', userId);
    // Navigate to user profile or open modal
  }

  resetPassword(userId: string) {
    if (confirm('Are you sure you want to reset this user\'s password?')) {
      this.userService.resetPassword(userId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Password reset email sent successfully');
          }
        },
        error: (error) => {
          console.error('Error resetting password:', error);
        }
      });
    }
  }

  toggleUserStatus(user: User) {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      const operation = user.isActive 
        ? this.userService.deactivateUser(user.id)
        : this.userService.activateUser(user.id);

      operation.subscribe({
        next: (response) => {
          if (response.success) {
            this.filtersSubject.next(this.filtersSubject.value); // Refresh list
          }
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
        }
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    const classes = {
      'SYSTEM_ADMIN': 'bg-danger text-white',
      'COMPLIANCE_OFFICER': 'bg-primary text-white',
      'DEPARTMENT_HEAD': 'bg-warning text-white',
      'EMPLOYEE': 'bg-success text-white'
    };
    return classes[role as keyof typeof classes] || 'bg-secondary text-white';
  }
}