import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'departments',
    loadComponent: () => import('./departments/departments.component').then(m => m.DepartmentsComponent)
  },
  {
    path: 'system',
    loadComponent: () => import('./system/system.component').then(m => m.SystemComponent)
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];