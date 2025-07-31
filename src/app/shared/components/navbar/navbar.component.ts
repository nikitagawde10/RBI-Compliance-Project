import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { User } from "../../../core/models/user.model";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser$ = this.authService.currentUser$;
  notifications$: Observable<any[]> = of([]);
  unreadCount$: Observable<number> = of(0);
  showNotifications = false;
  showProfile = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Close notifications if clicking outside
    if (
      this.showNotifications &&
      !target.closest(".nav-item:has(.notifications-dropdown)")
    ) {
      this.showNotifications = false;
    }

    // Close profile if clicking outside
    if (
      this.showProfile &&
      !target.closest(".nav-item:has(.profile-dropdown)")
    ) {
      this.showProfile = false;
    }
  }

  // ✅ Safe method to get user initials
  getUserInitials(user: User | null): string {
    if (!user) return "U";

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    const firstInitial = firstName.charAt(0).toUpperCase() || "";
    const lastInitial = lastName.charAt(0).toUpperCase() || "";

    return firstInitial + lastInitial || "U";
  }

  // ✅ Safe method to get user full name
  getUserFullName(user: User | null): string {
    if (!user) return "Unknown User";

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return "Unknown User";
    }
  }

  toggleNotifications(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showProfile = false;
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  toggleProfile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showNotifications = false;
    this.showProfile = !this.showProfile;
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  closeProfile() {
    this.showProfile = false;
  }

  loadNotifications() {
    this.notifications$ = this.notificationService
      .getNotifications()
      .pipe(map((response) => response.data || []));
  }

  loadUnreadCount() {
    this.unreadCount$ = this.notificationService
      .getUnreadCount()
      .pipe(map((response) => response.data?.count || 0));
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
      this.loadUnreadCount();
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
      this.loadUnreadCount();
    });
  }

  getNotificationIcon(type: string): string {
    const icons = {
      TASK: "fa-tasks",
      CIRCULAR: "fa-file-alt",
      SYSTEM: "fa-cog",
      REMINDER: "fa-bell",
    };
    return icons[type as keyof typeof icons] || "fa-info-circle";
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
