import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, BehaviorSubject } from "rxjs";
import { delay, switchMap, filter, take } from "rxjs/operators";
import { ApiResponse, FilterParams } from "../models/api.model";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private mockData: any = {};
  private mockDataLoaded$ = new BehaviorSubject<boolean>(false); // ✅ BehaviorSubject to track loading state

  constructor(private http: HttpClient) {
    this.loadMockData();
  }

  private loadMockData() {
    this.http.get("/assets/mock-data.json").subscribe({
      next: (data) => {
        this.mockData = data;
        this.mockDataLoaded$.next(true); // ✅ Emit true when loaded
      },
      error: (error) => {
        console.error("Failed to load mock data:", error);
        // Optionally set some default data or handle the error
        this.mockData = {
          users: [],
          departments: [],
          circulars: [],
          tasks: [],
          reports: [],
          notifications: [],
        };
        this.mockDataLoaded$.next(true); // ✅ Still emit true to prevent hanging
      },
    });
  }

  // ✅ Helper method to wait for data to be loaded
  private waitForMockData(): Observable<boolean> {
    return this.mockDataLoaded$.pipe(
      filter((loaded) => loaded), // Only proceed when data is loaded
      take(1) // Take only the first emission
    );
  }

  get<T>(endpoint: string, params?: FilterParams): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => (httpParams = httpParams.append(key, v)));
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    // ✅ Wait for mockData to be loaded before proceeding
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "GET", null, params).pipe(delay(500))
      )
    );
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "POST", data).pipe(delay(800))
      )
    );
  }

  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "PUT", data).pipe(delay(600))
      )
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.waitForMockData().pipe(
      switchMap(() =>
        this.getMockResponse<T>(endpoint, "DELETE").pipe(delay(400))
      )
    );
  }

  private getMockResponse<T>(
    endpoint: string,
    method: string,
    data?: any,
    params?: FilterParams
  ): Observable<ApiResponse<T>> {
    // Parse endpoint to determine resource and action
    const parts = endpoint.split("/").filter((p) => p);
    const resource = parts[0];
    const id = parts[1];
    const action = parts[2];

    let responseData: any;
    let success = true;
    let message = "";

    try {
      switch (resource) {
        case "users":
          responseData = this.handleUsersEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "departments":
          responseData = this.handleDepartmentsEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "circulars":
          responseData = this.handleCircularsEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "tasks":
          responseData = this.handleTasksEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "reports":
          responseData = this.handleReportsEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "notifications":
          responseData = this.handleNotificationsEndpoint(
            method,
            id,
            action,
            data,
            params
          );
          break;
        case "auth":
          responseData = this.handleAuthEndpoint(method, action, data);
          break;
        default:
          throw new Error(`Unknown resource: ${resource}`);
      }

      message = this.getSuccessMessage(method, resource);
    } catch (error) {
      success = false;
      message = (error as Error).message;
      responseData = null;
    }

    return of({
      success,
      data: responseData,
      message,
      pagination: this.getPaginationInfo(params, responseData),
    } as ApiResponse<T>);
  }
  private handleCircularsEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    // Ensure in-memory array exists
    const circulars = (this.mockData.circulars = this.mockData.circulars || []);

    switch (method) {
      case "GET": {
        if (id) {
          if (action === "ai-analysis") {
            const circ = circulars.find((c: any) => c.id === id);
            if (!circ) throw new Error("Circular not found");
            // Return the AI analysis for THIS circular (was incorrectly reading a root key before)
            return circ.aiAnalysis || {};
          }
          const circ = circulars.find((c: any) => c.id === id);
          if (!circ) throw new Error("Circular not found");
          return circ;
        }
        return this.applyFilters(circulars, params);
      }

      case "POST": {
        if (id && action === "ai-process") {
          // Simulate kicking off an AI processing job for this circular
          const circ = circulars.find((c: any) => c.id === id);
          if (!circ) throw new Error("Circular not found for AI processing");
          circ.updatedAt = new Date().toISOString();
          circ.status = "PROCESSING";
          return { processingId: this.generateId(), status: "PROCESSING" };
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
          id: this.generateId(),
          ...data,
          status: data?.status ?? "RECEIVED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        circulars.push(newCircular); // <-- persist so subsequent GET /circulars/:id works
        return newCircular;
      }

      case "PUT": {
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
      }

      case "DELETE": {
        if (!id) throw new Error("Circular id is required");
        const idx = circulars.findIndex((c: any) => c.id === id);
        if (idx === -1) return { id, deleted: false };
        circulars.splice(idx, 1);
        return { id, deleted: true };
      }

      default:
        throw new Error(`Method ${method} not supported for circulars`);
    }
  }

  private handleTasksEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    const tasks = (this.mockData.tasks = this.mockData.tasks || []);

    switch (method) {
      case "GET": {
        if (id) {
          if (action === "comments") {
            return (
              this.mockData.taskComments?.filter((c: any) => c.taskId === id) ||
              []
            );
          }
          if (action === "attachments") {
            return (
              this.mockData.taskAttachments?.filter(
                (a: any) => a.taskId === id
              ) || []
            );
          }
          if (action === "stats") {
            return this.mockData.taskStats || {};
          }
          const t = tasks.find((task: any) => task.id === id);
          if (!t) throw new Error("Task not found");
          return t;
        }
        if (action === "stats") {
          return this.mockData.taskStats || {};
        }
        return this.applyFilters(tasks, params);
      }

      case "POST": {
        if (action === "comments" && id) {
          const newComment = {
            id: this.generateId(),
            taskId: id,
            ...data,
            authorId: "current-user-id",
            authorName: "Current User",
            createdAt: new Date().toISOString(),
          };
          this.mockData.taskComments = this.mockData.taskComments || [];
          this.mockData.taskComments.push(newComment);
          return newComment;
        }

        const newTask = {
          id: this.generateId(),
          ...data,
          status: data?.status ?? "PENDING",
          progress: data?.progress ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask); // persist
        return newTask;
      }

      case "PUT": {
        if (!id) throw new Error("Task id is required");
        const idx = tasks.findIndex((t: any) => t.id === id);
        if (idx === -1) throw new Error("Task not found");
        const updated = {
          ...tasks[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        tasks[idx] = updated;
        return updated;
      }

      case "DELETE": {
        if (!id) throw new Error("Task id is required");
        const idx = tasks.findIndex((t: any) => t.id === id);
        if (idx === -1) return { id, deleted: false };
        tasks.splice(idx, 1);
        return { id, deleted: true };
      }

      default:
        throw new Error(`Method ${method} not supported for tasks`);
    }
  }

  private handleUsersEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    const users = (this.mockData.users = this.mockData.users || []);

    switch (method) {
      case "GET": {
        if (id) {
          const user = users.find((u: any) => u.id === id);
          if (!user) throw new Error("User not found");
          return user;
        }
        return this.applyFilters(users, params);
      }

      case "POST": {
        const newUser = {
          id: this.generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        this.mockData.users = this.mockData.users || [];
        this.mockData.users.push(newUser);
        return newUser;
      }

      case "PUT": {
        if (!id) throw new Error("User id is required");
        const idx = users.findIndex((u: any) => u.id === id);
        if (idx === -1) throw new Error("User not found");
        const updated = {
          ...users[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        users[idx] = updated;
        return updated;
      }

      case "DELETE": {
        if (!id) throw new Error("User id is required");
        const idx = users.findIndex((u: any) => u.id === id);
        if (idx === -1) return { id, deleted: false };
        users.splice(idx, 1);
        return { id, deleted: true };
      }

      default:
        throw new Error(`Method ${method} not supported for users`);
    }
  }

  private handleDepartmentsEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    const departments = (this.mockData.departments =
      this.mockData.departments || []);

    switch (method) {
      case "GET": {
        if (id) {
          const dept = departments.find((d: any) => d.id === id);
          if (!dept) throw new Error("Department not found");
          return dept;
        }
        return this.applyFilters(departments, params);
      }

      case "POST": {
        const newDepartment = {
          id: this.generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          memberCount: 0,
        };
        this.mockData.departments = this.mockData.departments || [];
        this.mockData.departments.push(newDepartment);
        return newDepartment;
      }

      case "PUT": {
        if (!id) throw new Error("Department id is required");
        const idx = departments.findIndex((d: any) => d.id === id);
        if (idx === -1) throw new Error("Department not found");
        const updated = {
          ...departments[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        departments[idx] = updated;
        return updated;
      }

      case "DELETE": {
        if (!id) throw new Error("Department id is required");
        const idx = departments.findIndex((d: any) => d.id === id);
        if (idx === -1) return { id, deleted: false };
        departments.splice(idx, 1);
        return { id, deleted: true };
      }

      default:
        throw new Error(`Method ${method} not supported for departments`);
    }
  }

  private handleReportsEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    const reports = this.mockData.reports || [];

    switch (method) {
      case "GET":
        if (action === "generate") {
          return { reportId: this.generateId(), status: "GENERATING" };
        }
        if (id) {
          return reports.find((r: any) => r.id === id);
        }
        return this.applyFilters(reports, params);
      case "POST":
        const newReport = {
          id: this.generateId(),
          ...data,
          status: "GENERATING",
          createdAt: new Date().toISOString(),
        };
        return newReport;
      default:
        throw new Error(`Method ${method} not supported for reports`);
    }
  }

  private handleNotificationsEndpoint(
    method: string,
    id?: string,
    action?: string,
    data?: any,
    params?: FilterParams
  ): any {
    const notifications = this.mockData.notifications || [];

    switch (method) {
      case "GET":
        if (action === "unread-count") {
          return { count: notifications.filter((n: any) => !n.read).length };
        }
        return this.applyFilters(notifications, params);
      case "PUT":
        if (action === "mark-read") {
          return { id, read: true, readAt: new Date().toISOString() };
        }
        if (action === "mark-all-read") {
          return {
            markedCount: notifications.filter((n: any) => !n.read).length,
          };
        }
        return { id, ...data, updatedAt: new Date().toISOString() };
      case "DELETE":
        return { id, deleted: true };
      default:
        throw new Error(`Method ${method} not supported for notifications`);
    }
  }

  private handleAuthEndpoint(method: string, action?: string, data?: any): any {
    switch (action) {
      case "login":
        if (method === "POST") {
          const user = this.mockData.users?.find(
            (u: any) => u.email === data.email
          );
          if (user) {
            return {
              user,
              token: "mock-jwt-token-" + this.generateId(),
              expiresAt: new Date(
                Date.now() + 8 * 60 * 60 * 1000
              ).toISOString(),
            };
          }
          throw new Error("Invalid credentials");
        }
        break;
      case "logout":
        if (method === "POST") {
          return { success: true };
        }
        break;
      case "refresh":
        if (method === "POST") {
          return {
            token: "mock-jwt-token-" + this.generateId(),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          };
        }
        break;
      default:
        throw new Error(`Unknown auth action: ${action}`);
    }
  }

  private applyFilters(data: any[], params?: FilterParams): any[] {
    if (!params) return data;

    let filtered = [...data];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply status filter
    if (params.status && params.status.length > 0) {
      filtered = filtered.filter((item) =>
        params.status!.includes(item.status)
      );
    }

    // Apply priority filter
    if (params.priority && params.priority.length > 0) {
      filtered = filtered.filter((item) =>
        params.priority!.includes(item.priority)
      );
    }

    // Apply department filter
    if (params.department && params.department.length > 0) {
      filtered = filtered.filter((item) =>
        params.department!.includes(item.department)
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return filtered.slice(startIndex, endIndex);
  }

  private getPaginationInfo(params?: FilterParams, data?: any[]): any {
    if (!params || !data) return undefined;

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = Array.isArray(data) ? data.length : 0;
    const totalPages = Math.ceil(total / limit);

    return { page, limit, total, totalPages };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getSuccessMessage(method: string, resource: string): string {
    const actions = {
      GET: "retrieved",
      POST: "created",
      PUT: "updated",
      DELETE: "deleted",
    };
    return `${resource} ${
      actions[method as keyof typeof actions]
    } successfully`;
  }
}
