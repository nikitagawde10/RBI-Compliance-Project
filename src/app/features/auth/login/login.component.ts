import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <div
                    class="bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style="width: 64px; height: 64px;"
                  >
                    <i class="fas fa-shield-alt fa-2x"></i>
                  </div>
                  <h2 class="fw-bold text-primary">Compliance Portal</h2>
                  <p class="text-muted">Sign in to your account</p>
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      [class.is-invalid]="
                        loginForm.get('email')?.invalid &&
                        loginForm.get('email')?.touched
                      "
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="
                        loginForm.get('email')?.invalid &&
                        loginForm.get('email')?.touched
                      "
                    >
                      Please enter a valid email address
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [class.is-invalid]="
                        loginForm.get('password')?.invalid &&
                        loginForm.get('password')?.touched
                      "
                    />
                    <div
                      class="invalid-feedback"
                      *ngIf="
                        loginForm.get('password')?.invalid &&
                        loginForm.get('password')?.touched
                      "
                    >
                      Password is required
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100 mb-4"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span
                      *ngIf="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    Sign In
                  </button>

                  <div class="text-center">
                    <div class="bg-light p-3 rounded">
                      <small class="text-muted d-block mb-2"
                        ><strong>Demo Credentials:</strong></small
                      >
                      <!-- <small class="text-muted d-block"
                        >Admin: admin&#64;compliance.com</small
                      > -->
                      <small class="text-muted d-block"
                        >Compliance: compliance&#64;compliance.com</small
                      >
                      <!-- <small class="text-muted d-block"
                        >Department Head: head&#64;compliance.com</small
                      >
                      <small class="text-muted d-block"
                        >Employee: employee&#64;compliance.com</small
                      > -->
                      <small class="text-muted d-block mt-2"
                        ><strong>Password:</strong> password</small
                      >
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .bg-light {
        background: linear-gradient(
          135deg,
          #f8fafc 0%,
          #e2e8f0 100%
        ) !important;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(["/circulars/upload"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Login failed:", error);
        },
      });
    }
  }
}
