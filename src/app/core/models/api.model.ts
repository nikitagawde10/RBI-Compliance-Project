// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// Request Models
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  departmentId?: string;
  isActive?: boolean;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  headId?: string;
  parentId?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  circularId?: string;
  priority: string;
  department: string;
  assignedTo: string;
  estimatedHours: number;
  dueDate: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  progress?: number;
  actualHours?: number;
  tags?: string[];
}

export interface CreateCircularRequest {
  referenceNumber: string;
  regulatoryBody: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  issuedDate: string;
  effectiveDate: string;
  content: string;
  attachments?: File[];
}

export interface TaskCommentRequest {
  content: string;
  isInternal?: boolean;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  priority?: string[];
  department?: string[];
  assignedTo?: string[];
  dateFrom?: string;
  dateTo?: string;
  role?: string[];
}
