import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Profile Settings</h1>
          <p class="text-muted mb-0">Manage your account information and preferences</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-user text-primary me-2"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label fw-semibold">First Name</label>
                    <input type="text" class="form-control" id="firstName" formControlName="firstName">
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label fw-semibold">Last Name</label>
                    <input type="text" class="form-control" id="lastName" formControlName="lastName">
                  </div>
                  <div class="col-12">
                    <label for="email" class="form-label fw-semibold">Email Address</label>
                    <input type="email" class="form-control" id="email" formControlName="email" readonly>
                    <div class="form-text">Email cannot be changed. Contact administrator if needed.</div>
                  </div>
                  <div class="col-md-6">
                    <label for="department" class="form-label fw-semibold">Department</label>
                    <input type="text" class="form-control" id="department" formControlName="department" readonly>
                  </div>
                  <div class="col-md-6">
                    <label for="role" class="form-label fw-semibold">Role</label>
                    <input type="text" class="form-control" id="role" formControlName="role" readonly>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid">
                    <i class="fas fa-save me-2"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-lock text-primary me-2"></i>
                Change Password
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
                <div class="row g-4">
                  <div class="col-12">
                    <label for="currentPassword" class="form-label fw-semibold">Current Password</label>
                    <input type="password" class="form-control" id="currentPassword" formControlName="currentPassword">
                  </div>
                  <div class="col-md-6">
                    <label for="newPassword" class="form-label fw-semibold">New Password</label>
                    <input type="password" class="form-control" id="newPassword" formControlName="newPassword">
                  </div>
                  <div class="col-md-6">
                    <label for="confirmPassword" class="form-label fw-semibold">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword">
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-warning" [disabled]="passwordForm.invalid">
                    <i class="fas fa-key me-2"></i>
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-chart-bar text-info me-2"></i>
                Account Statistics
              </h6>
            </div>
            <div class="card-body">
              <div class="row g-3 text-center">
                <div class="col-6">
                  <div class="p-3 bg-primary-subtle border border-primary-subtle rounded">
                    <div class="h5 fw-bold text-primary mb-1">24</div>
                    <small class="text-muted">Tasks Completed</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-success-subtle border border-success-subtle rounded">
                    <div class="h5 fw-bold text-success mb-1">8</div>
                    <small class="text-muted">Active Tasks</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-info-subtle border border-info-subtle rounded">
                    <div class="h5 fw-bold text-info mb-1">156h</div>
                    <small class="text-muted">Hours Logged</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-warning-subtle border border-warning-subtle rounded">
                    <div class="h5 fw-bold text-warning mb-1">92%</div>
                    <small class="text-muted">Completion Rate</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-bell text-warning me-2"></i>
                Notification Preferences
              </h6>
            </div>
            <div class="card-body">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="emailNotifications" checked>
                <label class="form-check-label" for="emailNotifications">
                  Email Notifications
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="taskReminders" checked>
                <label class="form-check-label" for="taskReminders">
                  Task Reminders
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="weeklyReports">
                <label class="form-check-label" for="weeklyReports">
                  Weekly Reports
                </label>
              </div>
              <button class="btn btn-sm btn-primary w-100">
                <i class="fas fa-save me-2"></i>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class ProfileComponent {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['John', [Validators.required]],
      lastName: ['Doe', [Validators.required]],
      email: ['employee@compliance.com'],
      department: ['Risk Management'],
      role: ['EMPLOYEE']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Updating profile...', this.profileForm.value);
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      console.log('Updating password...');
    }
  }
}