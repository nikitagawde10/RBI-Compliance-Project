import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { RegulatoryBody, Priority } from "../../../core/models/circular.model";

@Component({
  selector: "app-upload-circular",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="upload-container">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a routerLink="/circulars">
              <i class="fas fa-file-alt me-1"></i>
              Circulars
            </a>
          </li>
          <li class="breadcrumb-item active">Upload New Circular</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-upload text-primary me-2"></i>
                Upload New Circular
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label for="referenceNumber" class="form-label fw-semibold"
                      >Reference Number *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="referenceNumber"
                      formControlName="referenceNumber"
                      placeholder="e.g., RBI/2025/001"
                      [class.is-invalid]="
                        uploadForm.get('referenceNumber')?.invalid &&
                        uploadForm.get('referenceNumber')?.touched
                      "
                    />
                    <div class="invalid-feedback">
                      Reference number is required
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="regulatoryBody" class="form-label fw-semibold"
                      >Regulatory Body *</label
                    >
                    <select
                      class="form-select"
                      id="regulatoryBody"
                      formControlName="regulatoryBody"
                      [class.is-invalid]="
                        uploadForm.get('regulatoryBody')?.invalid &&
                        uploadForm.get('regulatoryBody')?.touched
                      "
                    >
                      <option value="">Select Regulatory Body</option>
                      <option value="RBI">Reserve Bank of India (RBI)</option>
                      <option value="SEBI">
                        Securities and Exchange Board (SEBI)
                      </option>
                      <option value="IRDAI">
                        Insurance Regulatory Authority (IRDAI)
                      </option>
                      <option value="NABARD">
                        National Bank for Agriculture (NABARD)
                      </option>
                      <option value="NPCI">
                        National Payments Corporation (NPCI)
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      Please select a regulatory body
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="title" class="form-label fw-semibold"
                      >Title *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      formControlName="title"
                      placeholder="Enter circular title"
                      [class.is-invalid]="
                        uploadForm.get('title')?.invalid &&
                        uploadForm.get('title')?.touched
                      "
                    />
                    <div class="invalid-feedback">Title is required</div>
                  </div>

                  <div class="col-12">
                    <label for="description" class="form-label fw-semibold"
                      >Description *</label
                    >
                    <textarea
                      class="form-control"
                      id="description"
                      rows="3"
                      formControlName="description"
                      placeholder="Brief description of the circular"
                      [class.is-invalid]="
                        uploadForm.get('description')?.invalid &&
                        uploadForm.get('description')?.touched
                      "
                    ></textarea>
                    <div class="invalid-feedback">Description is required</div>
                  </div>

                  <div class="col-md-6">
                    <label for="category" class="form-label fw-semibold"
                      >Category *</label
                    >
                    <select
                      class="form-select"
                      id="category"
                      formControlName="category"
                      [class.is-invalid]="
                        uploadForm.get('category')?.invalid &&
                        uploadForm.get('category')?.touched
                      "
                    >
                      <option value="">Select Category</option>
                      <option value="Risk Management">Risk Management</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Operations">Operations</option>
                      <option value="Technology">Technology</option>
                      <option value="Governance">Governance</option>
                      <option value="Customer Protection">
                        Customer Protection
                      </option>
                    </select>
                    <div class="invalid-feedback">Please select a category</div>
                  </div>

                  <div class="col-md-6">
                    <label for="priority" class="form-label fw-semibold"
                      >Priority *</label
                    >
                    <select
                      class="form-select"
                      id="priority"
                      formControlName="priority"
                      [class.is-invalid]="
                        uploadForm.get('priority')?.invalid &&
                        uploadForm.get('priority')?.touched
                      "
                    >
                      <option value="">Select Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                    <div class="invalid-feedback">
                      Please select priority level
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="issuedDate" class="form-label fw-semibold"
                      >Issued Date *</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="issuedDate"
                      formControlName="issuedDate"
                      [class.is-invalid]="
                        uploadForm.get('issuedDate')?.invalid &&
                        uploadForm.get('issuedDate')?.touched
                      "
                    />
                    <div class="invalid-feedback">Issued date is required</div>
                  </div>

                  <div class="col-md-6">
                    <label for="effectiveDate" class="form-label fw-semibold"
                      >Effective Date *</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="effectiveDate"
                      formControlName="effectiveDate"
                      [class.is-invalid]="
                        uploadForm.get('effectiveDate')?.invalid &&
                        uploadForm.get('effectiveDate')?.touched
                      "
                    />
                    <div class="invalid-feedback">
                      Effective date is required
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="content" class="form-label fw-semibold"
                      >Content *</label
                    >
                    <textarea
                      class="form-control"
                      id="content"
                      rows="8"
                      formControlName="content"
                      placeholder="Full content of the circular"
                      [class.is-invalid]="
                        uploadForm.get('content')?.invalid &&
                        uploadForm.get('content')?.touched
                      "
                    ></textarea>
                    <div class="invalid-feedback">Content is required</div>
                  </div>

                  <div class="col-12">
                    <label for="attachments" class="form-label fw-semibold"
                      >Attachments</label
                    >
                    <input
                      type="file"
                      class="form-control"
                      id="attachments"
                      multiple
                      accept=".pdf,.doc,.docx"
                      (change)="onFileSelect($event)"
                    />
                    <div class="form-text">
                      Upload PDF, DOC, or DOCX files. Maximum 10MB per file.
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    routerLink="/circulars"
                  >
                    <i class="fas fa-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-outline-primary"
                      (click)="saveDraft()"
                    >
                      <i class="fas fa-save me-2"></i>
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      [disabled]="uploadForm.invalid || isSubmitting"
                    >
                      <span
                        *ngIf="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i *ngIf="!isSubmitting" class="fas fa-upload me-2"></i>
                      Upload Circular
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-info-circle text-info me-2"></i>
                Upload Guidelines
              </h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <h6 class="fw-semibold">Required Information</h6>
                <ul class="list-unstyled small">
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Reference
                    number
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Regulatory
                    body
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Title and
                    description
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Category and
                    priority
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Important
                    dates
                  </li>
                  <li>
                    <i class="fas fa-check text-success me-2"></i>Full content
                  </li>
                </ul>
              </div>

              <div class="mb-3">
                <h6 class="fw-semibold">File Requirements</h6>
                <ul class="list-unstyled small">
                  <li>
                    <i class="fas fa-file-pdf text-danger me-2"></i>PDF files
                    preferred
                  </li>
                  <li>
                    <i class="fas fa-file-word text-primary me-2"></i>DOC/DOCX
                    accepted
                  </li>
                  <li>
                    <i class="fas fa-weight-hanging text-warning me-2"></i>Max
                    10MB per file
                  </li>
                  <li>
                    <i class="fas fa-shield-alt text-success me-2"></i>Virus
                    scan included
                  </li>
                </ul>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-robot me-2"></i>
                <strong>AI Processing:</strong> After upload, the circular will
                be automatically analyzed for action items and department
                assignments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .upload-container {
        padding: 2rem;
        max-width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class UploadCircularComponent {
  uploadForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.uploadForm = this.fb.group({
      referenceNumber: ["", [Validators.required]],
      regulatoryBody: ["", [Validators.required]],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      category: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      issuedDate: ["", [Validators.required]],
      effectiveDate: ["", [Validators.required]],
      content: ["", [Validators.required]],
    });
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  saveDraft() {
    console.log("Saving draft...", this.uploadForm.value);
    // Implement draft saving logic
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.isSubmitting = true;
      console.log("Uploading circular...", this.uploadForm.value);

      // Simulate upload process
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(["/circulars"]);
      }, 2000);
    }
  }
}
