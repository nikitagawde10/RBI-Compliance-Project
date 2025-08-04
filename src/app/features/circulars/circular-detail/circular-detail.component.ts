import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CircularService } from "../../../core/services/circular.service";
import { TaskService } from "../../../core/services/task.service";
import {
  Circular,
  CircularStatus,
  Priority,
} from "../../../core/models/circular.model";
import { Task } from "../../../core/models/task.model";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { FormsModule } from "@angular/forms";
import { User, UserRole } from "../../../core/models/user.model";
import { AuthService } from "../../../core/services/auth.service";
import { DepartmentService } from "../../../core/services/department.service";

@Component({
  selector: "app-circular-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./circular-detail.component.html",
  styleUrls: ["./circular-detail.component.css"],
})
export class CircularDetailComponent implements OnInit {
  circular$: Observable<Circular | undefined>;
  relatedTasks$: Observable<any[]>;
  showMoreMenu = false;
  selectedTask: Task | null = null;
  showEditModal: boolean = false;
  user: User | null = null;
  currentUser$: Observable<User | null>;
  departments$: Observable<any[]>;
  ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circularService: CircularService,
    private taskService: TaskService,
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.circular$ = this.route.params.pipe(
      switchMap((params) =>
        this.circularService
          .getCircularById(params["id"])
          .pipe(map((response) => response.data))
      )
    );
    this.departments$ = this.departmentService
      .getDepartments()
      .pipe(map((response) => response.data || []));
    this.relatedTasks$ = this.route.params.pipe(
      switchMap((params) =>
        this.taskService
          .getTasks()
          .pipe(
            map((response) =>
              response.data.filter((task) => task.circularId === params["id"])
            )
          )
      )
    );
  }

  editCircular() {
    this.route.params.subscribe((params) => {
      this.router.navigate(["/circulars", params["id"], "edit"]);
    });
  }
  goToTaskDetail(taskId: string) {
    this.router.navigate(["/tasks", , taskId]);
  }
  onDepartmentChange(event: any) {
    const selectedDepartment = event.target.value;
  }
  updateTask(taskId: string) {
    this.relatedTasks$.subscribe((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        this.selectedTask = { ...task }; // clone the task to avoid two-way binding issues
        this.showEditModal = true;
      }
    });
  }

  closeModal() {
    this.showEditModal = false;
    this.selectedTask = null;
  }

  saveTask() {
    if (!this.selectedTask) return;

    this.taskService
      .updateTask(this.selectedTask.id, this.selectedTask)
      .subscribe({
        next: () => {
          alert("Task updated successfully");
          this.showEditModal = false;
          this.selectedTask = null;

          // Refresh the task list
          this.relatedTasks$ = this.route.params.pipe(
            switchMap((params) =>
              this.taskService
                .getTasks()
                .pipe(
                  map((response) =>
                    response.data.filter(
                      (task) => task.circularId === params["id"]
                    )
                  )
                )
            )
          );
        },
        error: (err) => {
          alert("Failed to update task");
          console.error(err);
        },
      });
  }

  deleteTask(id: string) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.relatedTasks$ = this.route.params.pipe(
          switchMap((params) =>
            this.taskService
              .getTasks()
              .pipe(
                map((response) =>
                  response.data.filter(
                    (task) => task.circularId === params["id"]
                  )
                )
              )
          )
        );
      });
    }
  }

  toggleMoreMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showMoreMenu = !this.showMoreMenu;
  }

  downloadPDF(event: Event) {
    event.preventDefault();
    this.showMoreMenu = false;
    this.route.params.subscribe((params) => {
      console.log("Downloading PDF for circular:", params["id"]);
      alert("PDF download started");
    });
  }

  shareCircular(event: Event) {
    event.preventDefault();
    this.showMoreMenu = false;
    this.route.params.subscribe((params) => {
      console.log("Sharing circular:", params["id"]);
      if (navigator.share) {
        navigator.share({
          title: "Regulatory Circular",
          text: "Check out this regulatory circular",
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }
    });
  }

  printCircular(event: Event) {
    event.preventDefault();
    this.showMoreMenu = false;
    window.print();
  }

  deleteCircular(event: Event) {
    event.preventDefault();
    this.showMoreMenu = false;
    if (
      confirm(
        "Are you sure you want to delete this circular? This action cannot be undone."
      )
    ) {
      this.route.params.subscribe((params) => {
        this.circularService.deleteCircular(params["id"]).subscribe({
          next: (response) => {
            if (response.success) {
              alert("Circular deleted successfully");
              this.router.navigate(["/circulars"]);
            }
          },
          error: (error) => {
            console.error("Error deleting circular:", error);
            alert("Error deleting circular");
          },
        });
      });
    }
  }

  getStatusBadgeClass(status: CircularStatus): string {
    const classes = {
      [CircularStatus.RECEIVED]: "bg-info text-white",
      [CircularStatus.PROCESSING]: "bg-warning text-white",
      [CircularStatus.ASSIGNED]: "bg-primary text-white",
      [CircularStatus.IN_PROGRESS]: "bg-info text-white",
      [CircularStatus.COMPLETED]: "bg-success text-white",
      [CircularStatus.OVERDUE]: "bg-danger text-white",
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

  getTaskStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: "bg-secondary text-white",
      ACCEPTED: "bg-info text-white",
      IN_PROGRESS: "bg-warning text-white",
      UNDER_REVIEW: "bg-primary text-white",
      COMPLETED: "bg-success text-white",
      OVERDUE: "bg-danger text-white",
      REJECTED: "bg-dark text-white",
    };
    return statusMap[status] || "bg-secondary text-white";
  }
}
