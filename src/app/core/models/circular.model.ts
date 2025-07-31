export interface Circular {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  content: string;
  regulatoryBody: RegulatoryBody;
  category: string;
  priority: Priority;
  issuedDate: Date;
  effectiveDate: Date;
  attachments: Attachment[];
  aiAnalysis?: AIAnalysis;
  assignments: Assignment[];
  status: CircularStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAnalysis {
  id: string;
  confidence: number;
  suggestedDepartments: string[];
  extractedActions: ActionItem[];
  priorityAssessment: Priority;
  processingTime: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface ActionItem {
  id: string;
  description: string;
  priority: Priority;
  estimatedHours: number;
  dueDate: Date;
  assignedDepartment?: string;
  assignedUser?: string;
}

export interface Assignment {
  id: string;
  circularId: string;
  departmentId: string;
  userId?: string;
  actionItems: ActionItem[];
  status: AssignmentStatus;
  assignedBy: string;
  assignedAt: Date;
  dueDate: Date;
  completedAt?: Date;
  feedback?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export enum RegulatoryBody {
  RBI = 'RBI',
  SEBI = 'SEBI',
  IRDAI = 'IRDAI',
  NABARD = 'NABARD',
  NPCI = 'NPCI'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum CircularStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum AssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  REJECTED = 'REJECTED'
}