import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, FilterParams } from '../models/api.model';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'COMPLIANCE' | 'PERFORMANCE' | 'ANALYTICS' | 'CUSTOM';
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  generatedAt?: Date;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  parameters?: any;
}

export interface ReportRequest {
  title: string;
  description: string;
  type: string;
  parameters: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private apiService: ApiService) {}

  getReports(params?: FilterParams): Observable<ApiResponse<Report[]>> {
    return this.apiService.get<Report[]>('reports', params);
  }

  getReportById(id: string): Observable<ApiResponse<Report>> {
    return this.apiService.get<Report>(`reports/${id}`);
  }

  generateReport(reportData: ReportRequest): Observable<ApiResponse<Report>> {
    return this.apiService.post<Report>('reports', reportData);
  }

  downloadReport(id: string): Observable<ApiResponse<{ downloadUrl: string }>> {
    return this.apiService.get<{ downloadUrl: string }>(`reports/${id}/download`);
  }

  deleteReport(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`reports/${id}`);
  }

  getReportTypes(): Observable<ApiResponse<{ type: string; name: string; description: string }[]>> {
    return this.apiService.get<{ type: string; name: string; description: string }[]>('reports/types');
  }
}