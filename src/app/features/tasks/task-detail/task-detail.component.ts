import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TaskService } from "../../../core/services/task.service";
import { Task, TaskStatus, Priority } from "../../../core/models/task.model";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-task-detail",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./task-detail.component.html",
  styles: [
    `
      .task-detail-container {
        padding: 2rem;
        max-width: 100%;
        overflow-x: hidden;
      }

      .comment-item {
        padding: 1rem 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .comment-item:last-child {
        border-bottom: none;
      }
    `,
  ],
})
export class TaskDetailComponent implements OnInit {
  task$: Observable<Task | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.task$ = this.route.params.pipe(
      switchMap((params) => this.taskService.getTaskById(params["id"])),
      map((response) => response.data)
    );
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
}
