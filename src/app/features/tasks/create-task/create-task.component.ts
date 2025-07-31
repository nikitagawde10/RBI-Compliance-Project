import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { TaskService } from "../../../core/services/task.service";
import { CircularService } from "../../../core/services/circular.service";
import { UserService } from "../../../core/services/user.service";
import { DepartmentService } from "../../../core/services/department.service";
import { CreateTaskRequest } from "../../../core/models/api.model";
import { Priority } from "../../../core/models/task.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-create-task",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-task-container">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a routerLink="/tasks">
              <i class="fas fa-tasks me-1"></i>
              Tasks
            </a>
          </li>
          <li class="breadcrumb-item active">Create New Task</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-plus text-primary me-2"></i>
                Create New Task
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
                <div class="row g-4">
                  <div class="col-12">
                    <label for="title" class="form-label fw-semibold"
                      >Task Title *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      formControlName="title"
                      placeholder="Enter task title"
                      [class.is-invalid]="
                        taskForm.get('title')?.invalid &&
                        taskForm.get('title')?.touched
                      "
                    />
                    <div class="invalid-feedback">Task title is required</div>
                  </div>

                  <div class="col-12">
                    <label for="description" class="form-label fw-semibold"
                      >Description *</label
                    >
                    <textarea
                      class="form-control"
                      id="description"
                      rows="4"
                      formControlName="description"
                      placeholder="Detailed description of the task"
                      [class.is-invalid]="
                        taskForm.get('description')?.invalid &&
                        taskForm.get('description')?.touched
                      "
                    ></textarea>
                    <div class="invalid-feedback">Description is required</div>
                  </div>

                  <div class="col-md-6">
                    <label for="circularId" class="form-label fw-semibold"
                      >Related Circular</label
                    >
                    <select
                      class="form-select"
                      id="circularId"
                      formControlName="circularId"
                    >
                      <option value="">Select Circular (Optional)</option>
                      <option
                        *ngFor="let circular of circulars$ | async"
                        [value]="circular.id"
                      >
                        {{ circular.referenceNumber }} - {{ circular.title }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label for="priority" class="form-label fw-semibold"
                      >Priority *</label
                    >
                    <select
                      class="form-select"
                      id="priority"
                      formControlName="priority"
                      [class.is-invalid]="
                        taskForm.get('priority')?.invalid &&
                        taskForm.get('priority')?.touched
                      "
                    >
                      <option value="">Select Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                    <div class="invalid-feedback">
                      Please select priority level
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="department" class="form-label fw-semibold"
                      >Department *</label
                    >
                    <select
                      class="form-select"
                      id="department"
                      formControlName="department"
                      [class.is-invalid]="
                        taskForm.get('department')?.invalid &&
                        taskForm.get('department')?.touched
                      "
                      (change)="onDepartmentChange($event)"
                    >
                      <option value="">Select Department</option>
                      <option
                        *ngFor="let dept of departments$ | async"
                        [value]="dept.name"
                      >
                        {{ dept.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      Please select a department
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="assignedTo" class="form-label fw-semibold"
                      >Assign To *</label
                    >
                    <select
                      class="form-select"
                      id="assignedTo"
                      formControlName="assignedTo"
                      [class.is-invalid]="
                        taskForm.get('assignedTo')?.invalid &&
                        taskForm.get('assignedTo')?.touched
                      "
                    >
                      <option value="">Select User</option>
                      <option
                        *ngFor="let user of filteredUsers$ | async"
                        [value]="user.id"
                      >
                        {{ user.firstName }} {{ user.lastName }} ({{
                          user.role
                        }})
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      Please assign the task to a user
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="estimatedHours" class="form-label fw-semibold"
                      >Estimated Hours *</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="estimatedHours"
                      formControlName="estimatedHours"
                      min="1"
                      max="200"
                      placeholder="Hours"
                      [class.is-invalid]="
                        taskForm.get('estimatedHours')?.invalid &&
                        taskForm.get('estimatedHours')?.touched
                      "
                    />
                    <div class="invalid-feedback">
                      Please enter estimated hours (1-200)
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="dueDate" class="form-label fw-semibold"
                      >Due Date *</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="dueDate"
                      formControlName="dueDate"
                      [class.is-invalid]="
                        taskForm.get('dueDate')?.invalid &&
                        taskForm.get('dueDate')?.touched
                      "
                    />
                    <div class="invalid-feedback">Due date is required</div>
                  </div>

                  <div class="col-12">
                    <label for="tags" class="form-label fw-semibold"
                      >Tags</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="tags"
                      formControlName="tags"
                      placeholder="Enter tags separated by commas (e.g., compliance, urgent, review)"
                    />
                    <div class="form-text">
                      Add tags to help categorize and search for this task
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    routerLink="/tasks"
                  >
                    <i class="fas fa-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <div class="d-flex gap-2">
                    <!-- <button type="button" class="btn btn-outline-primary" (click)="saveDraft()">
                      <i class="fas fa-save me-2"></i>
                      Save Draft
                    </button> -->
                    <button
                      type="submit"
                      class="btn btn-primary"
                      [disabled]="taskForm.invalid || isSubmitting"
                    >
                      <span
                        *ngIf="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i *ngIf="!isSubmitting" class="fas fa-plus me-2"></i>
                      Create Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-lightbulb text-warning me-2"></i>
                Task Creation Tips
              </h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <h6 class="fw-semibold">Best Practices</h6>
                <ul class="list-unstyled small">
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Use clear,
                    descriptive titles
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Provide
                    detailed descriptions
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Set realistic
                    deadlines
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Assign to
                    appropriate department
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Use relevant
                    tags
                  </li>
                </ul>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Auto-notifications:</strong> Assigned users will receive
                email notifications about new tasks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .create-task-container {
        padding: 2rem;
        max-width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  isSubmitting = false;

  circulars$: Observable<any[]>;
  departments$: Observable<any[]>;
  users$: Observable<any[]>;
  filteredUsers$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private circularService: CircularService,
    private userService: UserService,
    private departmentService: DepartmentService
  ) {
    this.taskForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      circularId: [""],
      priority: ["", [Validators.required]],
      department: ["", [Validators.required]],
      assignedTo: ["", [Validators.required]],
      estimatedHours: [
        "",
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      dueDate: ["", [Validators.required]],
      tags: [""],
    });

    this.circulars$ = this.circularService
      .getCirculars()
      .pipe(map((response) => response.data || []));

    this.departments$ = this.departmentService
      .getDepartments()
      .pipe(map((response) => response.data || []));

    this.users$ = this.userService
      .getUsers()
      .pipe(map((response) => response.data || []));

    this.filteredUsers$ = this.users$;
  }

  ngOnInit(): void {}

  onDepartmentChange(event: any) {
    const selectedDepartment = event.target.value;
    if (selectedDepartment) {
      this.filteredUsers$ = this.users$.pipe(
        map((users) =>
          users.filter((user) => user.department?.name === selectedDepartment)
        )
      );
    } else {
      this.filteredUsers$ = this.users$;
    }

    // Reset assigned user when department changes
    this.taskForm.patchValue({ assignedTo: "" });
  }

  saveDraft() {
    console.log("Saving draft...", this.taskForm.value);
    // Implement draft saving logic
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting = true;

      const taskData: CreateTaskRequest = {
        ...this.taskForm.value,
        tags: this.taskForm.value.tags
          ? this.taskForm.value.tags.split(",").map((tag: string) => tag.trim())
          : [],
      };

      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.router.navigate(["/tasks"]);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error("Error creating task:", error);
        },
      });
    }
  }
}
