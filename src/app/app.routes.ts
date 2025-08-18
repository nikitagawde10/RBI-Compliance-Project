import { Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { RoleGuard } from "./core/guards/role.guard";
import { UserRole } from "./core/models/user.model";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "circulars",
    loadComponent: () =>
      import("./features/circulars/circulars.component").then(
        (m) => m.CircularsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "circulars/upload",
    loadComponent: () =>
      import(
        "./features/circulars/upload-circular/upload-circular.component"
      ).then((m) => m.UploadCircularComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "circulars/:id",
    loadComponent: () =>
      import(
        "./features/circulars/circular-detail/circular-detail.component"
      ).then((m) => m.CircularDetailComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "tasks",
    loadComponent: () =>
      import("./features/tasks/tasks.component").then((m) => m.TasksComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "tasks/create",
    loadComponent: () =>
      import("./features/tasks/create-task/create-task.component").then(
        (m) => m.CreateTaskComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "tasks/:id",
    loadComponent: () =>
      import("./features/tasks/task-detail/task-detail.component").then(
        (m) => m.TaskDetailComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "reports",
    loadComponent: () =>
      import("./features/reports/reports.component").then(
        (m) => m.ReportsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./features/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "notifications",
    loadComponent: () =>
      import("./features/notifications/notifications.component").then(
        (m) => m.NotificationsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./features/settings/settings.component").then(
        (m) => m.SettingsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((m) => m.adminRoutes),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SYSTEM_ADMIN] },
  },
  {
    path: "",
    redirectTo: "/circulars/upload",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/circulars/upload",
  },
];
