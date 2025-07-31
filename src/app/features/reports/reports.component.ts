import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, Report, ReportRequest } from '../../core/services/report.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Reports & Analytics</h1>
          <p class="text-muted mb-0">Generate comprehensive compliance reports and insights</p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" (click)="scheduleReport()">
              <i class="fas fa-calendar me-2"></i>
              Schedule Report
            </button>
            <button class="btn btn-primary" (click)="createCustomReport()">
              <i class="fas fa-plus me-2"></i>
              Custom Report
            </button>
          </div>
        </div>
      </div>
      
      <!-- Report Categories -->
      <div class="row mb-4">
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-primary-subtle text-primary-emphasis me-3">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div>
                  <h5 class="mb-1 fw-semibold">Compliance Overview</h5>
                  <p class="text-muted mb-0 small">Overall compliance metrics and trends</p>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small text-muted">Completion Rate</span>
                  <span class="fw-semibold text-success">87%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-success" style="width: 87%"></div>
                </div>
              </div>
              <button class="btn btn-primary w-100" (click)="generateReport('COMPLIANCE')">
                <i class="fas fa-download me-2"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-success-subtle text-success-emphasis me-3">
                  <i class="fas fa-users"></i>
                </div>
                <div>
                  <h5 class="mb-1 fw-semibold">Department Performance</h5>
                  <p class="text-muted mb-0 small">Department-wise task completion and efficiency</p>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small text-muted">Average Efficiency</span>
                  <span class="fw-semibold text-success">92%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-success" style="width: 92%"></div>
                </div>
              </div>
              <button class="btn btn-success w-100" (click)="generateReport('PERFORMANCE')">
                <i class="fas fa-download me-2"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="icon-wrapper bg-warning-subtle text-warning-emphasis me-3">
                  <i class="fas fa-clock"></i>
                </div>
                <div>
                  <h5 class="mb-1 fw-semibold">Time Analysis</h5>
                  <p class="text-muted mb-0 small">Task completion times and efficiency metrics</p>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small text-muted">Avg. Completion Time</span>
                  <span class="fw-semibold text-warning">5.2 days</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar bg-warning" style="width: 75%"></div>
                </div>
              </div>
              <button class="btn btn-warning w-100" (click)="generateReport('ANALYTICS')">
                <i class="fas fa-download me-2"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card text-center">
            <div class="icon-wrapper bg-primary-subtle text-primary-emphasis mx-auto mb-3">
              <i class="fas fa-file-alt"></i>
            </div>
            <h3 class="fw-bold text-primary mb-1">156</h3>
            <p class="text-muted mb-0 small text-uppercase fw-semibold">Total Circulars</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card text-center">
            <div class="icon-wrapper bg-success-subtle text-success-emphasis mx-auto mb-3">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="fw-bold text-success mb-1">142</h3>
            <p class="text-muted mb-0 small text-uppercase fw-semibold">Completed Tasks</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card text-center">
            <div class="icon-wrapper bg-warning-subtle text-warning-emphasis mx-auto mb-3">
              <i class="fas fa-clock"></i>
            </div>
            <h3 class="fw-bold text-warning mb-1">23</h3>
            <p class="text-muted mb-0 small text-uppercase fw-semibold">Pending Reviews</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card text-center">
            <div class="icon-wrapper bg-info-subtle text-info-emphasis mx-auto mb-3">
              <i class="fas fa-users"></i>
            </div>
            <h3 class="fw-bold text-info mb-1">8</h3>
            <p class="text-muted mb-0 small text-uppercase fw-semibold">Active Departments</p>
          </div>
        </div>
      </div>
      
      <!-- Report History -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-history text-primary me-2"></i>
              Report History
            </h5>
            <button class="btn btn-sm btn-outline-primary" (click)="filterReports()">
              <i class="fas fa-filter me-2"></i>
              Filter
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Report Details</th>
                  <th>Type</th>
                  <th>Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let report of reports$ | async">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" 
                           style="width: 40px; height: 40px;"
                           [ngClass]="getReportIconClass(report.type)">
                        <i class="fas" [ngClass]="getReportIcon(report.type)"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 fw-semibold">{{ report.title }}</h6>
                        <p class="text-muted mb-0 small">{{ report.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getTypeBadgeClass(report.type)">
                      <i class="fas" [ngClass]="getReportIcon(report.type)" style="margin-right: 4px;"></i>
                      {{ report.type }}
                    </span>
                  </td>
                  <td>
                    <div *ngIf="report.generatedAt">
                      <div class="fw-medium">{{ report.generatedAt | date:'dd MMM, yyyy' }}</div>
                      <small class="text-muted">{{ report.generatedAt | date:'HH:mm' }}</small>
                    </div>
                    <span *ngIf="!report.generatedAt" class="text-muted">Generating...</span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getStatusBadgeClass(report.status)">
                      <i class="fas" [ngClass]="getStatusIcon(report.status)" style="margin-right: 4px;"></i>
                      {{ report.status }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" 
                              title="Download" 
                              [disabled]="report.status !== 'COMPLETED'"
                              (click)="downloadReport(report.id)">
                        <i class="fas fa-download"></i>
                      </button>
                      <button class="btn btn-outline-info" 
                              title="View" 
                              [disabled]="report.status !== 'COMPLETED'"
                              (click)="viewReport(report.id)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-secondary" 
                              title="Share" 
                              [disabled]="report.status !== 'COMPLETED'"
                              (click)="shareReport(report.id)">
                        <i class="fas fa-share"></i>
                      </button>
                      <button class="btn btn-outline-danger" 
                              title="Delete" 
                              (click)="deleteReport(report.id)">
                        <i class="fas fa-trash"></i>
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
  `,
  styles: [`
    .reports-container {
      padding: 2rem;
      max-width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class ReportsComponent implements OnInit {
  reports$: Observable<Report[]>;

  constructor(private reportService: ReportService) {
    this.reports$ = this.reportService.getReports().pipe(
      map(response => response.data || [])
    );
  }

  ngOnInit(): void {}

  generateReport(type: string) {
    const reportData: ReportRequest = {
      title: `${type} Report - ${new Date().toLocaleDateString()}`,
      description: `Generated ${type.toLowerCase()} report`,
      type: type,
      parameters: {
        dateRange: '30days',
        includeCharts: true
      }
    };

    this.reportService.generateReport(reportData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Report generation started:', response.data);
          // Refresh reports list
          this.reports$ = this.reportService.getReports().pipe(
            map(response => response.data || [])
          );
        }
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  downloadReport(reportId: string) {
    this.reportService.downloadReport(reportId).subscribe({
      next: (response) => {
        if (response.success && response.data.downloadUrl) {
          window.open(response.data.downloadUrl, '_blank');
        }
      },
      error: (error) => {
        console.error('Error downloading report:', error);
      }
    });
  }

  viewReport(reportId: string) {
    console.log('Viewing report:', reportId);
    // Implement report viewing logic
  }

  shareReport(reportId: string) {
    console.log('Sharing report:', reportId);
    // Implement report sharing logic
  }

  deleteReport(reportId: string) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(reportId).subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh reports list
            this.reports$ = this.reportService.getReports().pipe(
              map(response => response.data || [])
            );
          }
        },
        error: (error) => {
          console.error('Error deleting report:', error);
        }
      });
    }
  }

  scheduleReport() {
    console.log('Scheduling report...');
    // Implement report scheduling logic
  }

  createCustomReport() {
    console.log('Creating custom report...');
    // Implement custom report creation logic
  }

  filterReports() {
    console.log('Filtering reports...');
    // Implement report filtering logic
  }

  getReportIconClass(type: string): string {
    const classes = {
      'COMPLIANCE': 'bg-primary-subtle text-primary',
      'PERFORMANCE': 'bg-success-subtle text-success',
      'ANALYTICS': 'bg-warning-subtle text-warning',
      'CUSTOM': 'bg-info-subtle text-info'
    };
    return classes[type as keyof typeof classes] || 'bg-secondary-subtle text-secondary';
  }

  getReportIcon(type: string): string {
    const icons = {
      'COMPLIANCE': 'fa-chart-line',
      'PERFORMANCE': 'fa-users',
      'ANALYTICS': 'fa-clock',
      'CUSTOM': 'fa-cog'
    };
    return icons[type as keyof typeof icons] || 'fa-file';
  }

  getTypeBadgeClass(type: string): string {
    const classes = {
      'COMPLIANCE': 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
      'PERFORMANCE': 'bg-success-subtle text-success-emphasis border border-success-subtle',
      'ANALYTICS': 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
      'CUSTOM': 'bg-info-subtle text-info-emphasis border border-info-subtle'
    };
    return classes[type as keyof typeof classes] || 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle';
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'GENERATING': 'bg-warning text-white',
      'COMPLETED': 'bg-success text-white',
      'FAILED': 'bg-danger text-white'
    };
    return classes[status as keyof typeof classes] || 'bg-secondary text-white';
  }

  getStatusIcon(status: string): string {
    const icons = {
      'GENERATING': 'fa-spinner',
      'COMPLETED': 'fa-check',
      'FAILED': 'fa-times'
    };
    return icons[status as keyof typeof icons] || 'fa-question';
  }
}