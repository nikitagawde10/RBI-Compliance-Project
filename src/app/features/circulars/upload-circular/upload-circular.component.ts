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
import { ApiService } from "../../../core/services/api.service";
import { finalize } from "rxjs/operators";

// Define interface for the created circular response
interface CreatedCircular {
  id: string;
  referenceNumber: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: "app-upload-circular",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./upload-circular.component.html",
  styleUrl: "./upload-circular.component.css",
})
export class UploadCircularComponent {
  uploadForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
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

  resetForm() {
    this.uploadForm.reset();
    this.selectedFiles = [];
    this.uploadError = null;
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.isSubmitting = true;
      this.uploadError = null;

      // Prepare the circular data
      const circularData = {
        ...this.uploadForm.value,
        // Convert date strings to ISO format if needed
        issuedDate: new Date(this.uploadForm.value.issuedDate).toISOString(),
        effectiveDate: new Date(
          this.uploadForm.value.effectiveDate
        ).toISOString(),
        // Add any additional fields that might be expected by the API
        attachments: this.selectedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        // Set initial status
        status: "RECEIVED",
      };

      console.log("Uploading circular...", circularData);

      // Call the API service to create the circular
      this.apiService
        .post<CreatedCircular>("circulars", circularData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              console.log("Circular created successfully:", response.data);
              // Navigate to the newly created circular's detail page
              this.router.navigate(["/circulars", response.data.id]);
            } else {
              this.uploadError =
                response.message || "Failed to create circular";
            }
          },
          error: (error) => {
            console.error("Error creating circular:", error);
            this.uploadError =
              "An error occurred while uploading the circular. Please try again.";
          },
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.uploadForm.controls).forEach((key) => {
        this.uploadForm.get(key)?.markAsTouched();
      });
    }
  }
}
