import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, CreateCircularRequest, FilterParams } from '../models/api.model';
import { Circular, AIAnalysis } from '../models/circular.model';

@Injectable({
  providedIn: 'root'
})
export class CircularService {
  constructor(private apiService: ApiService) {}

  getCirculars(params?: FilterParams): Observable<ApiResponse<Circular[]>> {
    return this.apiService.get<Circular[]>('circulars', params);
  }

  getCircularById(id: string): Observable<ApiResponse<Circular>> {
    return this.apiService.get<Circular>(`circulars/${id}`);
  }

  createCircular(circularData: CreateCircularRequest): Observable<ApiResponse<Circular>> {
    return this.apiService.post<Circular>('circulars', circularData);
  }

  updateCircular(id: string, circularData: Partial<CreateCircularRequest>): Observable<ApiResponse<Circular>> {
    return this.apiService.put<Circular>(`circulars/${id}`, circularData);
  }

  deleteCircular(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`circulars/${id}`);
  }

  processCircular(id: string): Observable<ApiResponse<{ processingId: string; status: string }>> {
    return this.apiService.post<{ processingId: string; status: string }>(`circulars/${id}/ai-process`, {});
  }

  getAIAnalysis(id: string): Observable<ApiResponse<AIAnalysis>> {
    return this.apiService.get<AIAnalysis>(`circulars/${id}/ai-analysis`);
  }

  updateCircularStatus(id: string, status: string): Observable<ApiResponse<Circular>> {
    return this.apiService.put<Circular>(`circulars/${id}`, { status });
  }

  assignCircular(id: string, assignments: any[]): Observable<ApiResponse<void>> {
    return this.apiService.post<void>(`circulars/${id}/assign`, { assignments });
  }
}