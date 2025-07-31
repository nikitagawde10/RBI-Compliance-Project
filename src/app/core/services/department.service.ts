import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CreateDepartmentRequest, FilterParams } from '../models/api.model';
import { Department } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private apiService: ApiService) {}

  getDepartments(params?: FilterParams): Observable<ApiResponse<Department[]>> {
    return this.apiService.get<Department[]>('departments', params);
  }

  getDepartmentById(id: string): Observable<ApiResponse<Department>> {
    return this.apiService.get<Department>(`departments/${id}`);
  }

  createDepartment(departmentData: CreateDepartmentRequest): Observable<ApiResponse<Department>> {
    return this.apiService.post<Department>('departments', departmentData);
  }

  updateDepartment(id: string, departmentData: Partial<CreateDepartmentRequest>): Observable<ApiResponse<Department>> {
    return this.apiService.put<Department>(`departments/${id}`, departmentData);
  }

  deleteDepartment(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`departments/${id}`);
  }

  getDepartmentMembers(id: string, params?: FilterParams): Observable<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`departments/${id}/members`, params);
  }
}