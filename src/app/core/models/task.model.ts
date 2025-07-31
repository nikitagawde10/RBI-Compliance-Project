export interface Task {
  id: string;
  title: string;
  description: string;
  circularId: string;
  assignmentId: string;
  assignedTo: TaskAssignedUser;
  assignedBy: TaskAssignedUser;
  department: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
}
export interface TaskAssignedUser {
  id: string;
  name: string;
  role: string;
}
export interface TaskAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  isInternal: boolean;
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TaskStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  COMPLETED = "COMPLETED",
  OVERDUE = "OVERDUE",
  REJECTED = "REJECTED",
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: Priority[];
  department?: string[];
  assignedTo?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  searchTerm?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  averageCompletionTime: number;
  completionRate: number;
}
