import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TaskService } from "../../../core/services/task.service";
import { Task, TaskStatus, Priority } from "../../../core/models/task.model";
import { Observable, BehaviorSubject, Subject, combineLatest } from "rxjs";
import { switchMap, map, takeUntil, tap, finalize } from "rxjs/operators";
import { User } from "../../../core/models/user.model";
import { AuthService } from "../../../core/services/auth.service";
import { CircularService } from "../../../core/services/circular.service";
import { Circular } from "../../../core/models/circular.model";
import { DepartmentService } from "../../../core/services/department.service";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../../core/services/user.service";

@Component({
  selector: "app-task-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./task-detail.component.html",
  styleUrl: "./task-detail.component.css",
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private taskSubject = new BehaviorSubject<Task | null>(null);

  task$: Observable<Task | null> = this.taskSubject.asObservable();
  // circular$: Observable<Circular | undefined>;
  departments$: Observable<any[]>;
  currentUser$: Observable<User | null>;

  selectedTask: Task | null = null;
  showEditModal: boolean = false;
  showSuccessToast: boolean = false;
  isSaving: boolean = false;
  user: User | null = null;
  circularName: string | null = null;

  users: User[] = [];
  filteredUsers: User[] = [];
  showSuggestions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circularService: CircularService,
    private taskService: TaskService,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private userService: UserService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.departments$ = this.departmentService
      .getDepartments()
      .pipe(map((response) => response.data || []));
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Subscribe to current user
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
    });

    // Load users for the dropdown
    this.loadUsers();

    // Load task details
    this.loadTaskDetails();
  }

  private loadUsers(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.users = (response.data || []).map((user) => ({
          ...user,
          displayName: `${user.firstName} ${user.lastName}`,
        }));
      });
  }

  private loadTaskDetails(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.taskService.getTaskById(params["id"])),
        map((response) => response.data),
        tap((task) => {
          if (task?.circularId) {
            this.loadCircularName(task.circularId);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((task) => {
        this.taskSubject.next(task);
      });
  }

  private loadCircularName(circularId: string): void {
    this.circularService
      .getCircularById(circularId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.circularName = res.data?.title;
      });
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
      [Priority.CRITICAL]: "bg-dark text-white",
    };
    return classes[priority] || "bg-secondary text-white";
  }

  updateTask(taskId: string): void {
    const currentTask = this.taskSubject.value;
    if (currentTask && currentTask.id === taskId) {
      this.selectedTask = { ...currentTask }; // Deep clone to avoid two-way binding issues
      this.showEditModal = true;
    } else {
      // Fallback: fetch task if not available
      this.taskService
        .getTaskById(taskId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response.data) {
            this.selectedTask = { ...response.data };
            this.showEditModal = true;
          }
        });
    }
  }

  markComplete(task: Task): void {
    const updatedTask = {
      ...task,
      status: TaskStatus.COMPLETED,
      progress: 100,
      updatedAt: new Date().toISOString(),
    };

    this.taskService
      .updateTask(task.id, updatedTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.taskSubject.next(response.data);
          this.showToast();
        },
        error: (error) => {
          console.error("Failed to mark task as complete:", error);
          // Could add error toast here
        },
      });
  }

  closeModal(): void {
    this.showEditModal = false;
    this.selectedTask = null;
    this.showSuggestions = false;
    this.filteredUsers = [];
  }

  saveTask(): void {
    if (!this.selectedTask) return;

    this.isSaving = true;

    // Update the updatedAt timestamp
    const taskToUpdate = {
      ...this.selectedTask,
      updatedAt: new Date().toISOString(),
    };

    this.taskService
      .updateTask(this.selectedTask.id, taskToUpdate)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          // Update the task in the observable
          this.taskSubject.next(response.data);

          // Close modal and show success message
          this.closeModal();
          this.showToast();
        },
        error: (error) => {
          console.error("Failed to update task:", error);
          // Could add error handling/toast here
        },
      });
  }

  filterUsers(): void {
    const query = this.selectedTask?.assignedTo?.name?.toLowerCase() || "";
    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query)
    );
  }

  selectUser(user: User): void {
    if (this.selectedTask) {
      this.selectedTask.assignedTo = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      };
      this.showSuggestions = false;
      this.filteredUsers = [];
    }
  }

  hideSuggestions(): void {
    // Delay to allow click selection
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  updateDueDate(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.selectedTask) {
      this.selectedTask.dueDate = new Date(input.value); // ✅ Valid assignment
    }
  }

  private showToast(): void {
    this.showSuccessToast = true;
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }
}
