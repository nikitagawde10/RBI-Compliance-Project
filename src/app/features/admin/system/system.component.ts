import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="system-container">
      <h1 class="h3 mb-4">System Settings</h1>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">AI Configuration</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">AI Processing Threshold</label>
                <input type="range" class="form-range" min="0" max="100" value="75">
                <small class="text-muted">Current: 75%</small>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" checked>
                  <label class="form-check-label">Auto-assignment enabled</label>
                </div>
              </div>
              <button class="btn btn-primary">Update Settings</button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Notification Settings</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" checked>
                  <label class="form-check-label">Email notifications</label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" checked>
                  <label class="form-check-label">SMS notifications</label>
                </div>
              </div>
              <button class="btn btn-primary">Update Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .system-container {
      padding: 2rem;
    }
  `]
})
export class SystemComponent {}