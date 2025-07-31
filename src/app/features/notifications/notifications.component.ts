import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2 text-gradient">Notifications</h1>
          <p class="text-muted mb-0">
            Stay updated with important alerts and messages
          </p>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-primary">
            <i class="fas fa-check-double me-2"></i>
            Mark All Read
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-bell text-primary me-2"></i>
                  Recent Notifications
                </h5>
                <div class="d-flex gap-2">
                  <select
                    class="form-select form-select-sm"
                    style="width: auto;"
                  >
                    <option value="">All Types</option>
                    <option value="task">Tasks</option>
                    <option value="circular">Circulars</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="notification-item unread">
                <div class="d-flex align-items-start p-3">
                  <div
                    class="bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px;"
                  >
                    <i class="fas fa-tasks"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div
                      class="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <h6 class="mb-1 fw-semibold">New task assigned</h6>
                        <p class="text-muted mb-1 small">
                          You have been assigned a new task: "Update Risk
                          Assessment Procedures"
                        </p>
                        <small class="text-muted">2 hours ago</small>
                      </div>
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-item">
                <div class="d-flex align-items-start p-3">
                  <div
                    class="bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px;"
                  >
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div
                      class="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <h6 class="mb-1 fw-semibold">New circular received</h6>
                        <p class="text-muted mb-1 small">
                          RBI/2025/003 - Updated KYC Guidelines has been
                          uploaded
                        </p>
                        <small class="text-muted">4 hours ago</small>
                      </div>
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-item">
                <div class="d-flex align-items-start p-3">
                  <div
                    class="bg-warning text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px;"
                  >
                    <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div
                      class="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <h6 class="mb-1 fw-semibold">Task due soon</h6>
                        <p class="text-muted mb-1 small">
                          Task "Compliance Policy Review" is due in 2 days
                        </p>
                        <small class="text-muted">6 hours ago</small>
                      </div>
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-item">
                <div class="d-flex align-items-start p-3">
                  <div
                    class="bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px;"
                  >
                    <i class="fas fa-cog"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div
                      class="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <h6 class="mb-1 fw-semibold">System maintenance</h6>
                        <p class="text-muted mb-1 small">
                          Scheduled maintenance on Sunday, 2 AM - 4 AM
                        </p>
                        <small class="text-muted">1 day ago</small>
                      </div>
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-chart-pie text-info me-2"></i>
                Notification Summary
              </h6>
            </div>
            <div class="card-body">
              <div class="row g-3 text-center">
                <div class="col-6">
                  <div
                    class="p-3 bg-primary-subtle border border-primary-subtle rounded"
                  >
                    <div class="h5 fw-bold text-primary mb-1">12</div>
                    <small class="text-muted">Unread</small>
                  </div>
                </div>
                <div class="col-6">
                  <div
                    class="p-3 bg-success-subtle border border-success-subtle rounded"
                  >
                    <div class="h5 fw-bold text-success mb-1">45</div>
                    <small class="text-muted">Total Today</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-cog text-warning me-2"></i>
                Notification Settings
              </h6>
            </div>
            <div class="card-body">
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="taskNotifications"
                  checked
                />
                <label class="form-check-label" for="taskNotifications">
                  Task Notifications
                </label>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="circularNotifications"
                  checked
                />
                <label class="form-check-label" for="circularNotifications">
                  Circular Notifications
                </label>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="systemNotifications"
                />
                <label class="form-check-label" for="systemNotifications">
                  System Notifications
                </label>
              </div>
              <button class="btn btn-sm btn-primary w-100">
                <i class="fas fa-save me-2"></i>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notifications-container {
        padding: 2rem;
        max-width: 100%;
        overflow-x: hidden;
      }

      .notification-item {
        border-bottom: 1px solid #e2e8f0;
        transition: background-color 0.15s ease-in-out;
      }

      .notification-item:hover {
        background-color: rgba(37, 99, 235, 0.05);
      }

      .notification-item.unread {
        background-color: rgba(37, 99, 235, 0.05);
        border-left: 4px solid #2563eb;
      }

      .notification-item:last-child {
        border-bottom: none;
      }
    `,
  ],
})
export class NotificationsComponent {}
