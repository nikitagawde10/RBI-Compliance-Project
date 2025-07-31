import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CreateTaskRequest, UpdateTaskRequest, TaskCommentRequest, FilterParams } from '../models/api.model';
import { Task, TaskStats } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private apiService: ApiService) {}

  getTasks(filter?: FilterParams): Observable<ApiResponse<Task[]>> {
    return this.apiService.get<Task[]>('tasks', filter);
  }

  getTaskById(id: string): Observable<ApiResponse<Task>> {
    return this.apiService.get<Task>(`tasks/${id}`);
  }

  createTask(taskData: CreateTaskRequest): Observable<ApiResponse<Task>> {
    return this.apiService.post<Task>('tasks', taskData);
  }

  updateTask(id: string, taskData: UpdateTaskRequest): Observable<ApiResponse<Task>> {
    return this.apiService.put<Task>(`tasks/${id}`, taskData);
  }

  updateTaskStatus(id: string, status: string): Observable<ApiResponse<Task>> {
    return this.apiService.put<Task>(`tasks/${id}`, { status });
  }

  updateTaskProgress(id: string, progress: number): Observable<ApiResponse<Task>> {
    return this.apiService.put<Task>(`tasks/${id}`, { progress });
  }

  deleteTask(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`tasks/${id}`);
  }

  getTaskStats(): Observable<ApiResponse<TaskStats>> {
    return this.apiService.get<TaskStats>('tasks/stats');
  }

  getTaskComments(taskId: string): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`tasks/${taskId}/comments`);
  }

  addTaskComment(taskId: string, comment: TaskCommentRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<any>(`tasks/${taskId}/comments`, comment);
  }

  getTaskAttachments(taskId: string): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`tasks/${taskId}/attachments`);
  }

  uploadTaskAttachment(taskId: string, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post<any>(`tasks/${taskId}/attachments`, formData);
  }
}