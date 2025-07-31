import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './app/core/services/auth.service';
import { NavbarComponent } from './app/shared/components/navbar/navbar.component';
import { SidebarComponent } from './app/shared/components/sidebar/sidebar.component';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <!-- Show navbar and sidebar only when authenticated and not on login page -->
      <app-navbar *ngIf="isAuthenticated && !isLoginPage"></app-navbar>
      
      <div class="main-content" [class.with-sidebar]="isAuthenticated && !isLoginPage">
        <app-sidebar *ngIf="isAuthenticated && !isLoginPage"></app-sidebar>
        
        <div class="content-area" [class.with-sidebar]="isAuthenticated && !isLoginPage">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8fafc;
      overflow-x: hidden;
    }
    
    .main-content {
      display: flex;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .main-content.with-sidebar {
      margin-top: 72px;
      min-height: calc(100vh - 72px);
    }
    
    .content-area {
      flex: 1;
      min-width: 0;
      overflow-x: hidden;
      padding: 0;
      width: 100%;
    }
    
    .content-area.with-sidebar {
      margin-left: 250px;
      width: calc(100vw - 250px);
    }
    
    @media (max-width: 768px) {
      .content-area.with-sidebar {
        margin-left: 0;
        width: 100%;
      }
    }
  `]
})
export class App {
  isAuthenticated = false;
  isLoginPage = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (!user && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });

    // Track current route to determine if we're on login page
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }
}

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));