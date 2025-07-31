export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  permissions: Permission[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headId?: string;
  parentId?: string;
  members: User[];
  memberCount?: number;
  activeTasks?: number;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  EMPLOYEE = 'EMPLOYEE'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: Date;
}