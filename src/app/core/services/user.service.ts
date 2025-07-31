import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CreateUserRequest, UpdateUserRequest, FilterParams } from '../models/api.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(params?: FilterParams): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>('users', params);
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.apiService.get<User>(`users/${id}`);
  }

  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.apiService.post<User>('users', userData);
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.apiService.put<User>(`users/${id}`, userData);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`users/${id}`);
  }

  resetPassword(id: string): Observable<ApiResponse<void>> {
    return this.apiService.post<void>(`users/${id}/reset-password`, {});
  }

  deactivateUser(id: string): Observable<ApiResponse<void>> {
    return this.apiService.put<void>(`users/${id}`, { isActive: false });
  }

  activateUser(id: string): Observable<ApiResponse<void>> {
    return this.apiService.put<void>(`users/${id}`, { isActive: true });
  }
}