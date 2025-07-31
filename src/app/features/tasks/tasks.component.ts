import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus, Priority } from '../../core/models/task.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid p-4">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Task Management</h1>
          <p class="text-muted mb-0">Track and manage compliance tasks efficiently</p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary">
              <i class="fas fa-filter me-2"></i>
              Filter Tasks
            </button>
            <a routerLink="/tasks/create" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>
              Create Task
            </a>
          </div>
        </div>
      </div>
      
      <!-- Task Stats -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-secondary text-white me-3">
                <i class="fas fa-inbox"></i>
              </div>
              <div>
                <h3 class="mb-0 fw-bold text-secondary">12</h3>
                <small class="text-muted text-uppercase fw-semibold">Pending</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card warning">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-warning text-white me-3">
                <i class="fas fa-clock"></i>
              </div>
              <div>
                <h3 class="mb-0 fw-bold text-warning">8</h3>
                <small class="text-muted text-uppercase fw-semibold">In Progress</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card success">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-success text-white me-3">
                <i class="fas fa-check-circle"></i>
              </div>
              <div>
                <h3 class="mb-0 fw-bold text-success">25</h3>
                <small class="text-muted text-uppercase fw-semibold">Completed</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stats-card danger">
            <div class="d-flex align-items-center">
              <div class="icon-wrapper bg-danger text-white me-3">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h3 class="mb-0 fw-bold text-danger">3</h3>
                <small class="text-muted text-uppercase fw-semibold">Overdue</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tasks Table -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-tasks text-primary me-2"></i>
              My Tasks
            </h5>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" style="width: auto;">
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select class="form-select form-select-sm" style="width: auto;">
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Task Details</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let task of tasks$ | async">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="bg-primary-subtle text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <i class="fas fa-file-alt"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 fw-semibold">
                          <a [routerLink]="['/tasks', task.id]" class="text-decoration-none">
                            {{ task.title }}
                          </a>
                        </h6>
                        <p class="text-muted mb-0 small">{{ task.description }}</p>
                        <div class="d-flex gap-2 mt-1">
                          <span class="badge bg-light text-dark border small">
                            <i class="fas fa-building me-1"></i>
                            {{ task.department }}
                          </span>
                          <span class="badge bg-light text-dark border small">
                            <i class="fas fa-clock me-1"></i>
                            {{ task.estimatedHours }}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getPriorityBadgeClass(task.priority)">
                      <i class="fas fa-flag me-1"></i>
                      {{ task.priority }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getStatusBadgeClass(task.status)">
                      <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                      {{ task.status }}
                    </span>
                  </td>
                  <td>
                    <div style="min-width: 120px;">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">{{ task.progress }}%</small>
                        <small class="text-muted">{{ task.progress === 100 ? 'Complete' : 'In Progress' }}</small>
                      </div>
                      <div class="progress" style="height: 6px;">
                        <div class="progress-bar" 
                             [style.width.%]="task.progress"
                             [ngClass]="getProgressBarClass(task.progress)">
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div class="fw-medium">{{ task.dueDate | date:'dd MMM' }}</div>
                      <small class="text-muted">{{ task.dueDate | date:'yyyy' }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <a [routerLink]="['/tasks', task.id]" class="btn btn-outline-primary" title="View Details">
                        <i class="fas fa-eye"></i>
                      </a>
                      <button class="btn btn-outline-success" title="Update Progress" (click)="updateProgress(task.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" (click)="addComment(task.id)"><i class="fas fa-comment me-2"></i>Add Comment</a></li>
                          <li><a class="dropdown-item" href="#" (click)="attachFile(task.id)"><i class="fas fa-paperclip me-2"></i>Attach File</a></li>
                          <li><a class="dropdown-item" href="#" (click)="shareTask(task.id)"><i class="fas fa-share me-2"></i>Share</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" (click)="deleteTask(task.id)"><i class="fas fa-trash me-2"></i>Delete</a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      max-width: 100%;
      overflow-x: hidden;
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks().pipe(
      map(response => response.data)
    );
  }

  ngOnInit(): void {}

  getStatusBadgeClass(status: TaskStatus): string {
    const classes = {
      [TaskStatus.PENDING]: 'bg-secondary text-white',
      [TaskStatus.ACCEPTED]: 'bg-info text-white',
      [TaskStatus.IN_PROGRESS]: 'bg-warning text-white',
      [TaskStatus.UNDER_REVIEW]: 'bg-primary text-white',
      [TaskStatus.COMPLETED]: 'bg-success text-white',
      [TaskStatus.OVERDUE]: 'bg-danger text-white',
      [TaskStatus.REJECTED]: 'bg-dark text-white'
    };
    return classes[status] || 'bg-secondary text-white';
  }

  getPriorityBadgeClass(priority: Priority): string {
    const classes = {
      [Priority.LOW]: 'bg-success-subtle text-success-emphasis border border-success-subtle',
      [Priority.MEDIUM]: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
      [Priority.HIGH]: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
      [Priority.CRITICAL]: 'bg-dark text-white'
    };
    return classes[priority] || 'bg-secondary text-white';
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    if (progress >= 25) return 'bg-primary';
    return 'bg-danger';
  }

  updateProgress(taskId: string) {
    console.log('Updating progress for task:', taskId);
    // Implement progress update logic
  }

  addComment(taskId: string) {
    console.log('Adding comment to task:', taskId);
    // Implement comment addition logic
  }

  attachFile(taskId: string) {
    console.log('Attaching file to task:', taskId);
    // Implement file attachment logic
  }

  shareTask(taskId: string) {
    console.log('Sharing task:', taskId);
    // Implement task sharing logic
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      console.log('Deleting task:', taskId);
      // Implement task deletion logic
    }
  }
}