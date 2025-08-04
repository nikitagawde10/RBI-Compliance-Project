import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { UserService } from "../../../core/services/user.service";
import { DepartmentService } from "../../../core/services/department.service";
import { User } from "../../../core/models/user.model";
import {
  CreateUserRequest,
  FilterParams,
} from "../../../core/models/api.model";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, switchMap, startWith } from "rxjs/operators";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./users.component.html",
  styles: [
    `
      .users-container {
        padding: 2rem;
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  filterForm: FormGroup;
  userForm: FormGroup;
  editingUser: User | null = null;
  isSubmitting = false;

  private filtersSubject = new BehaviorSubject<FilterParams>({});
  users$: Observable<User[]>;
  departments$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService
  ) {
    this.filterForm = this.fb.group({
      role: [""],
      department: [""],
      status: [""],
      search: [""],
    });

    this.userForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      role: ["", [Validators.required]],
      departmentId: ["", [Validators.required]],
      sendWelcomeEmail: [true],
    });

    this.users$ = this.filtersSubject.pipe(
      switchMap((filters) => this.userService.getUsers(filters)),
      map((response) => response.data || [])
    );

    this.departments$ = this.departmentService
      .getDepartments()
      .pipe(map((response) => response.data || []));
  }

  ngOnInit(): void {
    // Watch for filter changes
    this.filterForm.valueChanges
      .pipe(startWith(this.filterForm.value))
      .subscribe((filters) => {
        const cleanFilters: FilterParams = {};

        if (filters.search) cleanFilters.search = filters.search;
        if (filters.role) cleanFilters.role = [filters.role];
        if (filters.department) cleanFilters.department = [filters.department];
        if (filters.status) {
          cleanFilters.status =
            filters.status === "active" ? ["ACTIVE"] : ["INACTIVE"];
        }

        this.filtersSubject.next(cleanFilters);
      });
  }

  openAddUserModal() {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.patchValue({ sendWelcomeEmail: true });
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("userModal")
    );
    modal.show();
  }

  editUser(user: User) {
    this.editingUser = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      departmentId: user.department?.id,
    });
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("userModal")
    );
    modal.show();
  }

  saveUser() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = this.userForm.value;

      const operation = this.editingUser
        ? this.userService.updateUser(this.editingUser.id, userData)
        : this.userService.createUser(userData as CreateUserRequest);

      operation.subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            const modal = (window as any).bootstrap.Modal.getInstance(
              document.getElementById("userModal")
            );
            modal.hide();
            this.filtersSubject.next(this.filtersSubject.value); // Refresh list
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error("Error saving user:", error);
        },
      });
    }
  }

  viewProfile(userId: string) {
    console.log("Viewing profile:", userId);
    // Navigate to user profile or open modal
  }

  resetPassword(userId: string) {
    if (confirm("Are you sure you want to reset this user's password?")) {
      this.userService.resetPassword(userId).subscribe({
        next: (response) => {
          if (response.success) {
            alert("Password reset email sent successfully");
          }
        },
        error: (error) => {
          console.error("Error resetting password:", error);
        },
      });
    }
  }

  toggleUserStatus(user: User) {
    const action = user.isActive ? "deactivate" : "activate";
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      const operation = user.isActive
        ? this.userService.deactivateUser(user.id)
        : this.userService.activateUser(user.id);

      operation.subscribe({
        next: (response) => {
          if (response.success) {
            this.filtersSubject.next(this.filtersSubject.value); // Refresh list
          }
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
        },
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    const classes = {
      SYSTEM_ADMIN: "bg-danger text-white",
      COMPLIANCE_OFFICER: "bg-primary text-white",
      DEPARTMENT_HEAD: "bg-warning text-white",
      EMPLOYEE: "bg-success text-white",
    };
    return classes[role as keyof typeof classes] || "bg-secondary text-white";
  }
}
