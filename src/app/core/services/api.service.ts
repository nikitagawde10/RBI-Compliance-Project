import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, BehaviorSubject } from "rxjs";
import { delay, filter, switchMap, take } from "rxjs/operators";
import { ApiResponse, FilterParams } from "../models/api.model";

/**
 * NOTE: This service must not inject any domain services (CircularService, TaskService, etc.)
 * to avoid circular DI. It should only depend on HttpClient and be used by higher-level services.
 */
@Injectable({ providedIn: "root" })
export class ApiService {
  private mockData: any = {};
  private mockDataLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadMockData();
  }

  private loadMockData() {
    this.http.get("/assets/mock-data.json").subscribe({
      next: (data) => {
        this.mockData = data || {};
        this.mockDataLoaded$.next(true);
      },
      error: (err) => {
        console.error("Failed to load mock data:", err);
        this.mockData = {
          users: [],
          departments: [],
          circulars: [],
          tasks: [],
          reports: [],
          notifications: [],
        };
        this.mockDataLoaded$.next(true);
      },
    });
  }

  private waitForMockData(): Observable<boolean> {
    return this.mockDataLoaded$.pipe(filter(Boolean), take(1));
  }

  // ---------------- JSON helpers ----------------
  get<T>(endpoint: string, params?: FilterParams): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "GET", undefined, params).pipe(
          delay(300)
        )
      )
    );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "POST", data).pipe(delay(300))
      )
    );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "PUT", data).pipe(delay(300))
      )
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "DELETE").pipe(delay(300))
      )
    );
  }

  // ---------------- FormData helper (for file upload) ----------------
  postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "POST_FORMDATA", formData).pipe(
          delay(500)
        )
      )
    );
  }

  // ---------------- Mock router ----------------
  private getMockResponse<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "POST_FORMDATA",
    data?: any,
    params?: FilterParams
  ): Observable<ApiResponse<T>> {
    const parts = endpoint.split("/").filter(Boolean);
    const resource = parts[0];
    const id = parts[1];
    const action = parts[2];

    let responseData: any;
    let success = true;
    let message = "";

    try {
      switch (resource) {
        case "users":
          responseData = this.handleUsers(method, id, action, data, params);
          break;

        case "departments":
          responseData = this.handleDepartments(
            method,
            id,
            action,
            data,
            params
          );
          break;

        case "circulars":
          responseData = this.handleCirculars(method, id, action, data, params);
          break;

        case "tasks":
          responseData = this.handleTasks(method, id, action, data, params);
          break;

        case "reports":
          responseData = this.handleReports(method, id, action, data, params);
          break;

        case "notifications":
          responseData = this.handleNotifications(
            method,
            id,
            action,
            data,
            params
          );
          break;

        case "auth":
          responseData = this.handleAuth(method, action, data);
          break;

        default:
          throw new Error(`Unknown resource: ${resource}`);
      }

      message = this.successMessage(method, resource);
    } catch (e: any) {
      success = false;
      message = e.message ?? String(e);
      responseData = null;
    }

    return of({
      success,
      data: responseData,
      message,
      pagination: this.buildPagination(
        params,
        Array.isArray(responseData) ? responseData : undefined
      ),
    } as ApiResponse<T>);
  }

  // ---------------- Handlers ----------------
  private handleUsers(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    const users = this.mockData.users || [];
    switch (method) {
      case "GET":
        return id
          ? users.find((u: any) => u.id === id)
          : this.applyFilters(users, params);
      case "POST":
        return {
          id: this.id(),
          ...data,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
      case "PUT":
        return { id, ...data, updatedAt: new Date().toISOString() };
      case "DELETE":
        return { id, deleted: true };
      default:
        throw new Error("Unsupported method for users");
    }
  }

  private handleDepartments(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    const deps = this.mockData.departments || [];
    switch (method) {
      case "GET":
        return id
          ? deps.find((d: any) => d.id === id)
          : this.applyFilters(deps, params);
      case "POST":
        return {
          id: this.id(),
          ...data,
          createdAt: new Date().toISOString(),
          memberCount: 0,
        };
      case "PUT":
        return { id, ...data, updatedAt: new Date().toISOString() };
      case "DELETE":
        return { id, deleted: true };
      default:
        throw new Error("Unsupported method for departments");
    }
  }

  private handleCirculars(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    // Ensure in-memory array exists
    const circulars = (this.mockData.circulars = this.mockData.circulars || []);

    // Special AI extract route (file upload simulation)
    if (method === "POST_FORMDATA" && action === "ai-extract") {
      // Normally you'd parse the file and call an AI backend.
      // Here we return the mocked payload you described.
      const mockAI = {
        summary:
          "The document is a circular issued by the Reserve Bank of India (RBI) regarding compliance guidelines for Chief Compliance Officers (CCO) in banking institutions. The circular outlines the regulatory framework for appointment, tenure, and responsibilities of CCOs to ensure adherence to banking regulations and risk management protocols.",
        actionable_items:
          "• Policy: Board-approved compliance policy must be established\n• Tenor for appointment of CCO: Minimum 3 years tenure required\n• Transfer/Removal of CCO: Prior RBI approval mandatory\n• Reporting Structure: Direct reporting to MD/CEO required\n• Training: Mandatory compliance training programs\n• Risk Assessment: Quarterly compliance risk assessments",
        department_summary:
          "Summary for Compliance Department:\n\nThe department must implement new CCO appointment guidelines, establish board-approved policies, ensure proper reporting structures, and conduct regular training programs. Immediate action required for policy framework development and staff training initiatives.",
      };
      return mockAI;
    }

    switch (method) {
      case "GET":
        if (id) {
          if (action === "ai-analysis") {
            const circ = circulars.find((c: any) => c.id === id);
            if (!circ) throw new Error("Circular not found");
            return circ.aiAnalysis || {};
          }
          const circ = circulars.find((c: any) => c.id === id);
          if (!circ) throw new Error("Circular not found");
          return circ;
        }
        return this.applyFilters(circulars, params);

      case "POST":
        if (id && action === "ai-process") {
          // Simulate kicking off an AI processing job for this circular
          const circ = circulars.find((c: any) => c.id === id);
          if (!circ) throw new Error("Circular not found for AI processing");
          circ.updatedAt = new Date().toISOString();
          circ.status = "PROCESSING";
          return { processingId: this.id(), status: "PROCESSING" };
        }

        if (id && action === "assign") {
          // Simulate assignment update on a circular
          const circIndex = circulars.findIndex((c: any) => c.id === id);
          if (circIndex === -1)
            throw new Error("Circular not found for assignment");
          const circ = circulars[circIndex];
          const assignments = Array.isArray(data?.assignments)
            ? data.assignments
            : [];
          const updated = {
            ...circ,
            assignments,
            updatedAt: new Date().toISOString(),
            status: circ.status ?? "ASSIGNED",
          };
          circulars[circIndex] = updated;
          return { id, assignmentsUpdated: assignments.length };
        }

        // Create a new circular and persist it to in-memory store
        const newCircular = {
          id: this.id(),
          ...data,
          status: data?.status ?? "RECEIVED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        circulars.push(newCircular); // <-- persist so subsequent GET /circulars/:id works
        return newCircular;

      case "PUT":
        if (!id) throw new Error("Circular id is required");
        const idx = circulars.findIndex((c: any) => c.id === id);
        if (idx === -1) throw new Error("Circular not found");
        const updated = {
          ...circulars[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        circulars[idx] = updated;
        return updated;

      case "DELETE":
        if (!id) throw new Error("Circular id is required");
        const delIdx = circulars.findIndex((c: any) => c.id === id);
        if (delIdx === -1) return { id, deleted: false };
        circulars.splice(delIdx, 1);
        return { id, deleted: true };

      default:
        throw new Error(`Method ${method} not supported for circulars`);
    }
  }

  private handleTasks(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    const tasks = this.mockData.tasks || [];
    switch (method) {
      case "GET":
        if (id) {
          if (action === "comments")
            return (this.mockData.taskComments || []).filter(
              (c: any) => c.taskId === id
            );
          if (action === "attachments")
            return (this.mockData.taskAttachments || []).filter(
              (a: any) => a.taskId === id
            );
          if (action === "stats") return this.mockData.taskStats || {};
          return tasks.find((t: any) => t.id === id);
        }
        if (action === "stats") return this.mockData.taskStats || {};
        return this.applyFilters(tasks, params);

      case "POST":
        if (action === "comments") {
          return {
            id: this.id(),
            taskId: id,
            ...data,
            authorId: "current-user-id",
            authorName: "Current User",
            createdAt: new Date().toISOString(),
          };
        }
        return {
          id: this.id(),
          ...data,
          status: "PENDING",
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          assignedBy: "current-user-id",
        };

      case "PUT":
        return { id, ...data, updatedAt: new Date().toISOString() };

      case "DELETE":
        return { id, deleted: true };

      default:
        throw new Error("Unsupported method for tasks");
    }
  }

  private handleReports(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    const reports = this.mockData.reports || [];
    switch (method) {
      case "GET":
        if (action === "generate")
          return { reportId: this.id(), status: "GENERATING" };
        return id
          ? reports.find((r: any) => r.id === id)
          : this.applyFilters(reports, params);
      case "POST":
        return {
          id: this.id(),
          ...data,
          status: "GENERATING",
          createdAt: new Date().toISOString(),
        };
      default:
        throw new Error("Unsupported method for reports");
    }
  }

  private handleNotifications(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ) {
    const notifications = this.mockData.notifications || [];
    switch (method) {
      case "GET":
        if (action === "unread-count")
          return { count: notifications.filter((n: any) => !n.read).length };
        return this.applyFilters(notifications, params);
      case "PUT":
        if (action === "mark-read")
          return { id, read: true, readAt: new Date().toISOString() };
        if (action === "mark-all-read")
          return {
            markedCount: notifications.filter((n: any) => !n.read).length,
          };
        return { id, ...data, updatedAt: new Date().toISOString() };
      case "DELETE":
        return { id, deleted: true };
      default:
        throw new Error("Unsupported method for notifications");
    }
  }

  private handleAuth(method: string, action?: string, data?: any) {
    switch (action) {
      case "login": {
        if (method !== "POST") {
          throw new Error("Unsupported method for auth/login; expected POST");
        }
        const user = this.mockData.users?.find(
          (u: any) => u.email === data?.email
        );
        if (!user) {
          throw new Error("Invalid credentials");
        }
        return {
          user,
          token: "\u006dock-jwt-token-" + this.id(),
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        };
      }

      case "logout": {
        if (method !== "POST") {
          throw new Error("Unsupported method for auth/logout; expected POST");
        }
        return { success: true };
      }

      case "refresh": {
        if (method !== "POST") {
          throw new Error("Unsupported method for auth/refresh; expected POST");
        }
        return {
          token: "\u006dock-jwt-token-" + this.id(),
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        };
      }

      default: {
        throw new Error(`Unknown auth action: ${action}`);
      }
    }
  }

  // ---------------- utils ----------------
  private applyFilters(data: any[], params?: FilterParams): any[] {
    if (!params) return data;
    let filtered = [...data];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(term))
      );
    }
    if (params.status?.length)
      filtered = filtered.filter((i) => params.status!.includes(i.status));
    if (params.priority?.length)
      filtered = filtered.filter((i) => params.priority!.includes(i.priority));
    if (params.department?.length)
      filtered = filtered.filter((i) =>
        params.department!.includes(i.department)
      );

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }

  private buildPagination(params?: FilterParams, data?: any[]) {
    if (!params || !data) return undefined;
    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = data.length;
    return { page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  private id() {
    return Math.random().toString(36).slice(2, 11);
  }

  private successMessage(method: string, resource: string) {
    const actions: Record<string, string> = {
      GET: "retrieved",
      POST: "created",
      PUT: "updated",
      DELETE: "deleted",
      POST_FORMDATA: "uploaded",
    };
    return `${resource} ${actions[method] ?? "ok"}`;
  }
}
