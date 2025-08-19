import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {
  ApiResponse,
  CreateCircularRequest,
  FilterParams,
} from "../models/api.model";
import { Circular, AIAnalysis } from "../models/circular.model";
import { HttpClient } from "@angular/common/http";

// Define the AI extract response interface
export type AIExtractResponse = {
  summary: string;
  actionable_items: string;
  department_summary: Record<string, string>;
};

// Define the created circular interface
export interface CreatedCircular {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  regulatoryBody: string;
  issuedDate: string;
  effectiveDate: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  attachments?: any[];
  [key: string]: any;
}

@Injectable({ providedIn: "root" })
export class CircularService {
  ANALYZE_URL = "http://192.168.1.26:9006/analyze/";
  constructor(private api: ApiService, private http: HttpClient) {}

  getCirculars(params?: FilterParams): Observable<ApiResponse<Circular[]>> {
    return this.api.get<Circular[]>("circulars", params);
  }

  getCircularById(id: string): Observable<ApiResponse<Circular>> {
    return this.api.get<Circular>(`circulars/${id}`);
  }

  createCircular(
    payload: CreateCircularRequest
  ): Observable<ApiResponse<CreatedCircular>> {
    return this.api.post<CreatedCircular>("circulars", payload);
  }

  updateCircular(
    id: string,
    data: Partial<CreateCircularRequest>
  ): Observable<ApiResponse<Circular>> {
    return this.api.put<Circular>(`circulars/${id}`, data);
  }

  deleteCircular(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`circulars/${id}`);
  }

  processCircular(
    id: string
  ): Observable<ApiResponse<{ processingId: string; status: string }>> {
    return this.api.post<{ processingId: string; status: string }>(
      `circulars/${id}/ai-process`,
      {}
    );
  }

  getAIAnalysis(id: string): Observable<ApiResponse<AIAnalysis>> {
    return this.api.get<AIAnalysis>(`circulars/${id}/ai-analysis`);
  }

  updateCircularStatus(
    id: string,
    status: string
  ): Observable<ApiResponse<Circular>> {
    return this.api.put<Circular>(`circulars/${id}`, { status });
  }

  assignCircular(
    id: string,
    assignments: any[]
  ): Observable<ApiResponse<void>> {
    return this.api.post<void>(`circulars/${id}/assign`, { assignments });
  }

  /**
   * AI extract endpoint using FormData.
   * Backend route (mocked in ApiService): POST_FORMDATA circulars/ai-extract
   */
  aiExtract(file: File): Observable<AIExtractResponse> {
    const fd = new FormData();
    // The field name 'file' must match what your backend expects
    fd.append("file", file, file.name);
    // Do NOT set Content-Type manually; let the browser set the multipart boundary
    return this.http.post<AIExtractResponse>(this.ANALYZE_URL, fd);
  }
}
