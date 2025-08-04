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
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-create-task",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./create-task.component.html",
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
