import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { TaskService } from "../../core/services/task.service";
import { CircularService } from "../../core/services/circular.service";
import { NotificationService } from "../../core/services/notification.service";
import { User, UserRole } from "../../core/models/user.model";
import { TaskStats } from "../../core/models/task.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  taskStats$: Observable<TaskStats>;
  recentActivities$: Observable<any[]>;
  showQuickActions = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private circularService: CircularService,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.taskStats$ = this.taskService
      .getTaskStats()
      .pipe(map((response) => response.data));
    this.recentActivities$ = this.notificationService
      .getNotifications({ limit: 5 })
      .pipe(map((response) => response.data || []));
  }

  ngOnInit(): void {}

  toggleQuickActions(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showQuickActions = !this.showQuickActions;
  }

  navigateToTasks(filter: string) {
    // Navigate to tasks with specific filter
    console.log("Navigating to tasks with filter:", filter);
  }

  exportData() {
    console.log("Exporting dashboard data...");
    // Implement data export functionality
  }

  getActivityIconClass(type: string): string {
    const classes = {
      TASK: "bg-primary text-white",
      CIRCULAR: "bg-success text-white",
      SYSTEM: "bg-info text-white",
      REMINDER: "bg-warning text-white",
    };
    return classes[type as keyof typeof classes] || "bg-secondary text-white";
  }

  getActivityIcon(type: string): string {
    const icons = {
      TASK: "fa-tasks",
      CIRCULAR: "fa-file-alt",
      SYSTEM: "fa-cog",
      REMINDER: "fa-bell",
    };
    return icons[type as keyof typeof icons] || "fa-info-circle";
  }
}
