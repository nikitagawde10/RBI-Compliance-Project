import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TaskService } from "../../core/services/task.service";
import { Task, TaskStatus, Priority } from "../../core/models/task.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./tasks.component.html",
  styles: [
    `
      .container-fluid {
        max-width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class TasksComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService
      .getTasks()
      .pipe(map((response) => response.data));
  }

  ngOnInit(): void {}

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
      [Priority.CRITICAL]: "bg-dark text-white",
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
}
