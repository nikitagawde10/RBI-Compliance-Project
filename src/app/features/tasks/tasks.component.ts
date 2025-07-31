import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TaskService } from "../../core/services/task.service";
import { AuthService } from "../../core/services/auth.service";
import { Task, TaskStatus, Priority } from "../../core/models/task.model";
import { User, UserRole } from "../../core/models/user.model";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";

interface TaskStats {
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./tasks.component.html",
  styles: [
    `
      .container-fluid {
        max-width: 100%;
        overflow-x: hidden;
      }
      .stats-card {
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e9ecef;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .stats-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class TasksComponent implements OnInit {
  allTasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  taskStats$: Observable<TaskStats>;
  currentUser$: Observable<User | null>;

  // Filter subjects
  private statusFilter$ = new BehaviorSubject<string>("");
  private priorityFilter$ = new BehaviorSubject<string>("");

  // Filter form values
  selectedStatus: string = "";
  selectedPriority: string = "";

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    // Get all tasks
    this.allTasks$ = this.taskService
      .getTasks()
      .pipe(map((response) => response.data));

    // Setup role-based filtered tasks
    this.filteredTasks$ = combineLatest([
      this.allTasks$,
      this.currentUser$,
      this.statusFilter$.pipe(startWith("")),
      this.priorityFilter$.pipe(startWith("")),
    ]).pipe(
      map(([tasks, user, statusFilter, priorityFilter]) => {
        if (!user) return [];

        // First apply role-based filtering
        let roleFilteredTasks = this.filterTasksByRole(tasks, user);

        // Then apply UI filters
        return this.applyUIFilters(
          roleFilteredTasks,
          statusFilter,
          priorityFilter
        );
      })
    );

    // Calculate task statistics
    this.taskStats$ = this.filteredTasks$.pipe(
      map((tasks) => this.calculateTaskStats(tasks))
    );
  }

  ngOnInit(): void {}

  clearStatusFilter() {
    this.selectedStatus = "";
    this.onStatusChange({ target: { value: "" } } as any);
  }

  clearPriorityFilter() {
    this.selectedPriority = "";
    this.onPriorityChange({ target: { value: "" } } as any);
  }
  // Filter tasks based on user role
  private filterTasksByRole(tasks: Task[], user: User): Task[] {
    switch (user.role) {
      case UserRole.SYSTEM_ADMIN:
        // System admin can see all tasks
        return tasks;

      case UserRole.COMPLIANCE_OFFICER:
        // Compliance officers can see:
        // 1. Tasks assigned to them
        // 2. Tasks they assigned to others
        // 3. Tasks in their department
        return tasks.filter(
          (task) =>
            task.assignedTo.id === user.id ||
            task.assignedBy.id === user.id ||
            task.department === user.department?.name
        );

      case UserRole.DEPARTMENT_HEAD:
        // Department heads can see:
        // 1. Tasks assigned to them
        // 2. Tasks they assigned to others
        // 3. All tasks in their department
        return tasks.filter(
          (task) =>
            task.assignedTo.id === user.id ||
            task.assignedBy.id === user.id ||
            task.department === user.department?.name
        );

      case UserRole.EMPLOYEE:
        // Employees can only see tasks assigned to them
        return tasks.filter((task) => task.assignedTo.id === user.id);

      default:
        return [];
    }
  }

  // Apply UI filters (status, priority)
  private applyUIFilters(
    tasks: Task[],
    statusFilter: string,
    priorityFilter: string
  ): Task[] {
    let filtered = [...tasks];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    return filtered;
  }

  // Calculate task statistics
  private calculateTaskStats(tasks: Task[]): TaskStats {
    return {
      pending: tasks.filter(
        (t) =>
          t.status === TaskStatus.PENDING || t.status === TaskStatus.ACCEPTED
      ).length,
      inProgress: tasks.filter(
        (t) =>
          t.status === TaskStatus.IN_PROGRESS ||
          t.status === TaskStatus.UNDER_REVIEW
      ).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      overdue: tasks.filter((t) => t.status === TaskStatus.OVERDUE).length,
    };
  }

  // Filter change handlers
  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || "";
    this.selectedStatus = value;
    this.statusFilter$.next(value);
  }

  onPriorityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || "";
    this.selectedPriority = value;
    this.priorityFilter$.next(value);
  }

  // Clear filters
  clearFilters(): void {
    this.selectedStatus = "";
    this.selectedPriority = "";
    this.statusFilter$.next("");
    this.priorityFilter$.next("");
  }

  // Check if any filters are active
  hasActiveFilters(): boolean {
    return !!(this.selectedStatus || this.selectedPriority);
  }

  // Get user role display name
  getUserRoleDisplay(user: User | null): string {
    if (!user) return "";

    const roleNames = {
      [UserRole.SYSTEM_ADMIN]: "System Administrator",
      [UserRole.COMPLIANCE_OFFICER]: "Compliance Officer",
      [UserRole.DEPARTMENT_HEAD]: "Department Head",
      [UserRole.EMPLOYEE]: "Employee",
    };

    return roleNames[user.role] || user.role;
  }

  // Check if user can see all department tasks
  canSeeAllDepartmentTasks(user: User | null): boolean {
    if (!user) return false;
    return [
      UserRole.SYSTEM_ADMIN,
      UserRole.COMPLIANCE_OFFICER,
      UserRole.DEPARTMENT_HEAD,
    ].includes(user.role);
  }

  getStatusBadgeClass(status: TaskStatus): string {
    const classes = {
      [TaskStatus.PENDING]: "bg-secondary text-white",
      [TaskStatus.ACCEPTED]: "bg-info text-white",
      [TaskStatus.IN_PROGRESS]: "bg-warning text-white",
      [TaskStatus.UNDER_REVIEW]: "bg-primary text-white",
      [TaskStatus.COMPLETED]: "bg-success text-white",
      [TaskStatus.OVERDUE]: "bg-danger text-white",
      [TaskStatus.REJECTED]: "bg-dark text-white",
    };
    return classes[status] || "bg-secondary text-white";
  }

  getPriorityBadgeClass(priority: Priority): string {
    const classes = {
      [Priority.LOW]:
        "bg-success-subtle text-success-emphasis border border-success-subtle",
      [Priority.MEDIUM]:
        "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
      [Priority.HIGH]:
        "bg-danger-subtle text-danger-emphasis border border-danger-subtle",
      [Priority.CRITICAL]: "bg-danger text-white",
    };
    return classes[priority] || "bg-secondary text-white";
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 100) return "bg-success";
    if (progress >= 75) return "bg-info";
    if (progress >= 50) return "bg-warning";
    if (progress >= 25) return "bg-primary";
    return "bg-danger";
  }

  // Check if current user can perform actions on task
  canEditTask(task: Task, user: User | null): boolean {
    if (!user) return false;

    // System admin can edit all tasks
    if (user.role === UserRole.SYSTEM_ADMIN) return true;

    // Users can edit tasks assigned to them
    if (task.assignedTo.id === user.id) return true;

    // Users can edit tasks they assigned
    if (task.assignedBy.id === user.id) return true;

    // Department heads and compliance officers can edit tasks in their department
    if (
      [UserRole.DEPARTMENT_HEAD, UserRole.COMPLIANCE_OFFICER].includes(
        user.role
      ) &&
      task.department === user.department?.name
    ) {
      return true;
    }

    return false;
  }

  updateProgress(taskId: string) {
    console.log("Updating progress for task:", taskId);
    // Implement progress update logic
  }

  addComment(taskId: string) {
    console.log("Adding comment to task:", taskId);
    // Implement comment addition logic
  }

  attachFile(taskId: string) {
    console.log("Attaching file to task:", taskId);
    // Implement file attachment logic
  }

  shareTask(taskId: string) {
    console.log("Sharing task:", taskId);
    // Implement task sharing logic
  }

  deleteTask(taskId: string) {
    if (confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", taskId);
      // Implement task deletion logic
    }
  }

  // TrackBy function for better performance
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
