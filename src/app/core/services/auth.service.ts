import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock login - in real app, this would call API
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      firstName: this.getFirstName(credentials.email),
      lastName: 'User',
      role: this.getRoleFromEmail(credentials.email),
      department: {
        id: '1',
        name: 'Risk Management',
        code: 'RISK',
        description: 'Risk Management Department',
        members: []
      },
      isActive: true,
      createdAt: new Date(),
      permissions: []
    };

    const response: LoginResponse = {
      user: mockUser,
      token: 'mock-jwt-token',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
    };

    return of(response).pipe(
      delay(1000),
      map(res => {
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res.user);
        return res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  private getFirstName(email: string): string {
    const names = {
      'admin@compliance.com': 'System Admin',
      'compliance@compliance.com': 'Compliance Officer',
      'head@compliance.com': 'Department Head',
      'employee@compliance.com': 'Employee'
    };
    return names[email as keyof typeof names] || 'User';
  }

  private getRoleFromEmail(email: string): UserRole {
    if (email === 'admin@compliance.com') return UserRole.SYSTEM_ADMIN;
    if (email === 'compliance@compliance.com') return UserRole.COMPLIANCE_OFFICER;
    if (email === 'head@compliance.com') return UserRole.DEPARTMENT_HEAD;
    return UserRole.EMPLOYEE;
  }
}