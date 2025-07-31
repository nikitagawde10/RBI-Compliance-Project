import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Settings</h1>
          <p class="text-muted mb-0">Customize your application preferences and settings</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-palette text-primary me-2"></i>
                Appearance
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="appearanceForm">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label for="theme" class="form-label fw-semibold">Theme</label>
                    <select class="form-select" id="theme" formControlName="theme">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="language" class="form-label fw-semibold">Language</label>
                    <select class="form-select" id="language" formControlName="language">
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="dateFormat" class="form-label fw-semibold">Date Format</label>
                    <select class="form-select" id="dateFormat" formControlName="dateFormat">
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="timezone" class="form-label fw-semibold">Timezone</label>
                    <select class="form-select" id="timezone" formControlName="timezone">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    Save Appearance
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-bell text-primary me-2"></i>
                Notifications
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="notificationForm">
                <div class="row g-4">
                  <div class="col-12">
                    <h6 class="fw-semibold mb-3">Email Notifications</h6>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="emailTasks" formControlName="emailTasks">
                      <label class="form-check-label" for="emailTasks">
                        Task assignments and updates
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="emailCirculars" formControlName="emailCirculars">
                      <label class="form-check-label" for="emailCirculars">
                        New circular notifications
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="emailReports" formControlName="emailReports">
                      <label class="form-check-label" for="emailReports">
                        Weekly and monthly reports
                      </label>
                    </div>
                  </div>
                  
                  <div class="col-12">
                    <h6 class="fw-semibold mb-3">Push Notifications</h6>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="pushTasks" formControlName="pushTasks">
                      <label class="form-check-label" for="pushTasks">
                        Task reminders
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" id="pushDeadlines" formControlName="pushDeadlines">
                      <label class="form-check-label" for="pushDeadlines">
                        Deadline alerts
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    Save Notifications
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-shield-alt text-primary me-2"></i>
                Privacy & Security
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <div class="col-12">
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="twoFactor" checked>
                    <label class="form-check-label" for="twoFactor">
                      Enable two-factor authentication
                    </label>
                  </div>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="sessionTimeout">
                    <label class="form-check-label" for="sessionTimeout">
                      Auto-logout after 30 minutes of inactivity
                    </label>
                  </div>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="loginAlerts" checked>
                    <label class="form-check-label" for="loginAlerts">
                      Email alerts for new login sessions
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="d-flex justify-content-end mt-4">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>
                  Save Security
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-info-circle text-info me-2"></i>
                Application Info
              </h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label fw-semibold text-muted small">Version</label>
                <div class="fw-semibold">v1.0.0</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-muted small">Last Updated</label>
                <div class="fw-semibold">January 15, 2024</div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-muted small">Build</label>
                <div class="fw-semibold">#2024.01.15.001</div>
              </div>
              <hr>
              <div class="d-grid gap-2">
                <button class="btn btn-outline-info">
                  <i class="fas fa-question-circle me-2"></i>
                  Help & Support
                </button>
                <button class="btn btn-outline-secondary">
                  <i class="fas fa-file-alt me-2"></i>
                  Release Notes
                </button>
              </div>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-download text-success me-2"></i>
                Data Export
              </h6>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                Export your data for backup or migration purposes.
              </p>
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary">
                  <i class="fas fa-download me-2"></i>
                  Export Tasks
                </button>
                <button class="btn btn-outline-success">
                  <i class="fas fa-download me-2"></i>
                  Export Reports
                </button>
                <button class="btn btn-outline-info">
                  <i class="fas fa-download me-2"></i>
                  Export All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class SettingsComponent {
  appearanceForm: FormGroup;
  notificationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.appearanceForm = this.fb.group({
      theme: ['light'],
      language: ['en'],
      dateFormat: ['dd/mm/yyyy'],
      timezone: ['Asia/Kolkata']
    });

    this.notificationForm = this.fb.group({
      emailTasks: [true],
      emailCirculars: [true],
      emailReports: [false],
      pushTasks: [true],
      pushDeadlines: [true]
    });
  }
}