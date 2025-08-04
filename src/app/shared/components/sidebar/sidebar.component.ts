import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { User, UserRole } from "../../../core/models/user.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="p-3">
        <div class="mb-4">
          <!-- <h6 class="text-muted mb-0 text-uppercase fw-semibold small">
            Navigation
          </h6> -->
        </div>

        <nav class="nav flex-column">
          <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
            <i class="fas fa-tachometer-alt me-3"></i>
            Dashboard
          </a>

          <a class="nav-link" routerLink="/circulars" routerLinkActive="active">
            <i class="fas fa-file-alt me-3"></i>
            Circulars
          </a>

          <a class="nav-link" routerLink="/tasks" routerLinkActive="active">
            <i class="fas fa-tasks me-3"></i>
            Tasks
          </a>

          <a
            *ngIf="user?.role !== 'EMPLOYEE'"
            class="nav-link"
            routerLink="/reports"
            routerLinkActive="active"
          >
            <i class="fas fa-chart-bar me-3"></i>
            Reports
          </a>

          <hr class="my-3" *ngIf="isAdmin$ | async" />

          <div *ngIf="isAdmin$ | async">
            <h6 class="text-muted mb-3 text-uppercase fw-semibold small">
              Administration
            </h6>

            <a
              class="nav-link"
              routerLink="/admin/users"
              routerLinkActive="active"
            >
              <i class="fas fa-users me-3"></i>
              User Management
            </a>

            <a
              class="nav-link"
              routerLink="/admin/departments"
              routerLinkActive="active"
            >
              <i class="fas fa-building me-3"></i>
              Departments
            </a>

            <a
              class="nav-link"
              routerLink="/admin/system"
              routerLinkActive="active"
            >
              <i class="fas fa-cogs me-3"></i>
              System Settings
            </a>
          </div>
        </nav>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        top: 72px;
        left: 0;
        width: 250px;
        height: calc(100vh - 72px);
        overflow-y: auto;
        z-index: 100;
      }

      .nav-link {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
      }

      .nav-link i {
        width: 20px;
        text-align: center;
      }

      @media (max-width: 768px) {
        .sidebar {
          left: -250px;
          z-index: 1000;
        }

        .sidebar.show {
          left: 0;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  user: User | null = null;
  currentUser$: Observable<User | null>;

  isAdmin$ = this.authService.currentUser$.pipe(
    map((user) => user?.role === UserRole.SYSTEM_ADMIN)
  );

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
  ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.user = user;
    });
    console.log(this.user);
  }
}
