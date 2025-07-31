import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, FilterParams } from '../models/api.model';

export interface Notification {
  id: string;
  type: 'TASK' | 'CIRCULAR' | 'SYSTEM' | 'REMINDER';
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: Date;
  readAt?: Date;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private apiService: ApiService) {}

  getNotifications(params?: FilterParams): Observable<ApiResponse<Notification[]>> {
    return this.apiService.get<Notification[]>('notifications', params);
  }

  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.apiService.get<{ count: number }>('notifications/unread-count');
  }

  markAsRead(id: string): Observable<ApiResponse<void>> {
    return this.apiService.put<void>(`notifications/${id}/mark-read`, {});
  }

  markAllAsRead(): Observable<ApiResponse<{ markedCount: number }>> {
    return this.apiService.put<{ markedCount: number }>('notifications/mark-all-read', {});
  }

  deleteNotification(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`notifications/${id}`);
  }
}