import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReportService,
  Report,
  ReportRequest,
} from "../../core/services/report.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./reports.component.html",
  styles: [
    `
      .reports-container {
        padding: 2rem;
        max-width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class ReportsComponent implements OnInit {
  reports$: Observable<Report[]>;

  constructor(private reportService: ReportService) {
    this.reports$ = this.reportService
      .getReports()
      .pipe(map((response) => response.data || []));
  }

  ngOnInit(): void {}

  generateReport(type: string) {
    const reportData: ReportRequest = {
      title: `${type} Report - ${new Date().toLocaleDateString()}`,
      description: `Generated ${type.toLowerCase()} report`,
      type: type,
      parameters: {
        dateRange: "30days",
        includeCharts: true,
      },
    };

    this.reportService.generateReport(reportData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log("Report generation started:", response.data);
          // Refresh reports list
          this.reports$ = this.reportService
            .getReports()
            .pipe(map((response) => response.data || []));
        }
      },
      error: (error) => {
        console.error("Error generating report:", error);
      },
    });
  }

  downloadReport(reportId: string) {
    this.reportService.downloadReport(reportId).subscribe({
      next: (response) => {
        if (response.success && response.data.downloadUrl) {
          window.open(response.data.downloadUrl, "_blank");
        }
      },
      error: (error) => {
        console.error("Error downloading report:", error);
      },
    });
  }

  viewReport(reportId: string) {
    console.log("Viewing report:", reportId);
    // Implement report viewing logic
  }

  shareReport(reportId: string) {
    console.log("Sharing report:", reportId);
    // Implement report sharing logic
  }

  deleteReport(reportId: string) {
    if (confirm("Are you sure you want to delete this report?")) {
      this.reportService.deleteReport(reportId).subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh reports list
            this.reports$ = this.reportService
              .getReports()
              .pipe(map((response) => response.data || []));
          }
        },
        error: (error) => {
          console.error("Error deleting report:", error);
        },
      });
    }
  }

  scheduleReport() {
    console.log("Scheduling report...");
    // Implement report scheduling logic
  }

  createCustomReport() {
    console.log("Creating custom report...");
    // Implement custom report creation logic
  }

  filterReports() {
    console.log("Filtering reports...");
    // Implement report filtering logic
  }

  getReportIconClass(type: string): string {
    const classes = {
      COMPLIANCE: "bg-primary-subtle text-primary",
      PERFORMANCE: "bg-success-subtle text-success",
      ANALYTICS: "bg-warning-subtle text-warning",
      CUSTOM: "bg-info-subtle text-info",
    };
    return (
      classes[type as keyof typeof classes] ||
      "bg-secondary-subtle text-secondary"
    );
  }

  getReportIcon(type: string): string {
    const icons = {
      COMPLIANCE: "fa-chart-line",
      PERFORMANCE: "fa-users",
      ANALYTICS: "fa-clock",
      CUSTOM: "fa-cog",
    };
    return icons[type as keyof typeof icons] || "fa-file";
  }

  getTypeBadgeClass(type: string): string {
    const classes = {
      COMPLIANCE:
        "bg-primary-subtle text-primary-emphasis border border-primary-subtle",
      PERFORMANCE:
        "bg-success-subtle text-success-emphasis border border-success-subtle",
      ANALYTICS:
        "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
      CUSTOM: "bg-info-subtle text-info-emphasis border border-info-subtle",
    };
    return (
      classes[type as keyof typeof classes] ||
      "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle"
    );
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      GENERATING: "bg-warning text-white",
      COMPLETED: "bg-success text-white",
      FAILED: "bg-danger text-white",
    };
    return classes[status as keyof typeof classes] || "bg-secondary text-white";
  }

  getStatusIcon(status: string): string {
    const icons = {
      GENERATING: "fa-spinner",
      COMPLETED: "fa-check",
      FAILED: "fa-times",
    };
    return icons[status as keyof typeof icons] || "fa-question";
  }
}
