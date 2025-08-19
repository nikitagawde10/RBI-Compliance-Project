import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CircularService } from "../../../core/services/circular.service";

type AiResult = {
  summary: string;
  actionable_items: string;
  department_summary: Record<string, string>;
};

@Component({
  selector: "app-upload-circular",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./upload-circular-demo.component.html",
  styleUrl: "./upload-circular-demo.component.css",
})
export class UploadCircularComponent {
  uploadForm: FormGroup;
  uploadError: string | null = null;

  // AI extraction state
  aiFile: File | null = null;
  aiIsExtracting = false;
  aiResult: AiResult | null = null;

  // Formatted HTML content
  summaryHtml: SafeHtml = "";
  actionablesHtml: SafeHtml = "";
  departmentEntries: Array<{ name: string; html: SafeHtml }> = [];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private circularService: CircularService
  ) {
    this.uploadForm = this.fb.group({
      regulatoryBody: ["", Validators.required],
    });
  }

  onAIFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.aiFile = input.files?.[0] ?? null;
  }

  runAIExtract() {
    this.uploadError = null;

    // Validation
    if (!this.uploadForm.get("regulatoryBody")?.value) {
      this.uploadError = "Please select a regulatory body.";
      return;
    }
    if (!this.aiFile) {
      this.uploadError = "Please upload a document to extract.";
      return;
    }

    this.aiIsExtracting = true;
    this.aiResult = null;

    this.circularService.aiExtract(this.aiFile).subscribe({
      next: (result) => {
        this.aiResult = result;
        this.formatAllContent(result);
        this.aiIsExtracting = false;
      },
      error: (err) => {
        this.aiIsExtracting = false;
        this.uploadError =
          err?.error?.message || err?.message || "AI extraction failed";
      },
    });
  }

  private formatAllContent(result: AiResult) {
    // Format summary with proper paragraph breaks and bold text
    this.summaryHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.formatText(result.summary)
    );

    // Format actionable items with nested lists and bold headers
    this.actionablesHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.formatActionables(result.actionable_items)
    );

    // Format department entries
    this.departmentEntries = Object.entries(
      result.department_summary || {}
    ).map(([name, content]) => ({
      name,
      html: this.sanitizer.bypassSecurityTrustHtml(this.formatText(content)),
    }));
  }

  private formatText(text: string): string {
    if (!text) return "";

    // Escape HTML first
    let formatted = this.escapeHtml(text);

    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Handle numbered lists (1., 2., etc.)
    formatted = formatted.replace(/^(\d+\.\s)/gm, "<li>$1");

    // Handle bullet points (*, -, •, +)
    formatted = formatted.replace(/^[\s]*[*\-•+]\s/gm, "<li>");

    // Handle tab-indented items (\t* or \t+)
    formatted = formatted.replace(
      /^\t[\s]*[*\-•+]\s/gm,
      "<li class='indented'>"
    );

    // Split into paragraphs on double line breaks
    const paragraphs = formatted.split(/\n\s*\n/);

    return paragraphs
      .map((paragraph) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return "";

        // Check if this paragraph contains list items
        if (trimmed.includes("<li>")) {
          // Wrap list items in <ul>
          const listItems = trimmed
            .split("\n")
            .map((line) => {
              line = line.trim();
              if (line.startsWith("<li>")) {
                return (
                  line
                    .replace("<li>", "<li>")
                    .replace(/(<li>)(\d+\.\s)?/, "$1") + "</li>"
                );
              }
              if (line.startsWith("<li class='indented'>")) {
                return line + "</li>";
              }
              return line;
            })
            .join("");

          return `<ul>${listItems}</ul>`;
        }

        // Regular paragraph
        return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
      })
      .join("");
  }
  getDepartmentIcon(departmentName: string): string {
    const iconMap: Record<string, string> = {
      Administration: "fas fa-cogs",
      Compliance: "fas fa-shield-alt",
      "Risk Management": "fas fa-exclamation-triangle",
      Operations: "fas fa-industry",
      "IT Security": "fas fa-lock",
      Finance: "fas fa-dollar-sign",
      "Human Resources": "fas fa-users",
    };

    return iconMap[departmentName] || "fas fa-building";
  }
  private formatActionables(text: string): string {
    if (!text) return "";

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line);
    let html = "";
    let currentSection = "";
    let inList = false;

    for (const line of lines) {
      // Check for department headers: **Department Name**
      const deptMatch = line.match(/^\*\*([^*]+)\*\*$/);
      if (deptMatch) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        currentSection = deptMatch[1].trim();
        html += `<h6 class="fw-bold text-primary mt-3 mb-2">${this.escapeHtml(
          currentSection
        )}</h6>`;
        continue;
      }

      // Check for bullet points
      if (line.match(/^[*\-•+]\s/)) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        const content = line.replace(/^[*\-•+]\s/, "");
        html += `<li>${this.formatInlineText(content)}</li>`;
        continue;
      }

      // Check for sub-bullets (indented with tabs or spaces)
      if (line.match(/^\s+[*\-•+]\s/) || line.match(/^\t[*\-•+]\s/)) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        const content = line.replace(/^\s*[*\-•+]\s/, "");
        html += `<li class="ms-3">${this.formatInlineText(content)}</li>`;
        continue;
      }

      // Regular text
      if (inList) {
        html += "</ul>";
        inList = false;
      }

      if (line) {
        html += `<p>${this.formatInlineText(line)}</p>`;
      }
    }

    if (inList) {
      html += "</ul>";
    }

    return html;
  }

  private formatInlineText(text: string): string {
    return this.escapeHtml(text).replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );
  }

  private escapeHtml(text: string): string {
    return (text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  trackByDept = (_: number, item: { name: string }) => item.name;

  // Placeholder methods referenced in template
  onSubmitManual() {
    // No-op for this demo
  }
}
