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
  styleUrl: "./upload-circular.component.css",
})
export class UploadCircularComponent {
  // minimal form to satisfy template bindings
  uploadForm: FormGroup;

  // UI state
  isSubmitting = false;
  uploadError: string | null = null;

  // AI flow
  aiFile: File | null = null;
  aiIsExtracting = false;
  aiResult: AiResult | null = null;

  // Rendered sections
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

  /* ---------------- manual submit (no-op for this view) ---------------- */
  onSubmitManual() {
    this.isSubmitting = true;
    this.uploadError = null;
    setTimeout(() => (this.isSubmitting = false), 300);
  }

  /* ---------------- AI Extract ---------------- */
  onAIFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.aiFile = input.files?.[0] ?? null;
  }

  runAIExtract() {
    this.uploadError = null;

    if (!this.uploadForm.get("regulatoryBody")?.value) {
      this.uploadError = "Please select a regulatory body.";
      return;
    }
    if (!this.aiFile) {
      this.uploadError = "Please upload a document to extract.";
      return;
    }

    this.aiIsExtracting = true;

    // 🔥 call your endpoint
    this.circularService.aiExtract(this.aiFile).subscribe({
      next: (res) => {
        this.aiResult = res;
        console.log("AI Extract Result:", res);
        // Render sections with your existing helpers
        this.summaryHtml = this.sanitizeHtml(this.textToBullets(res.summary));
        this.actionablesHtml = this.sanitizeHtml(
          this.actionablesToHtml(res.actionable_items)
        );
        this.departmentEntries = this.buildDepartmentEntries(
          res.department_summary
        );

        this.aiIsExtracting = false;
      },
      error: (err) => {
        this.aiIsExtracting = false;
        this.uploadError =
          err?.error?.message || err?.message || "AI extraction failed";
      },
    });
  }

  /* ---------------- Department helpers ---------------- */

  private buildDepartmentEntries(
    dept: Record<string, string> | undefined | null
  ): Array<{ name: string; html: SafeHtml }> {
    const out: Array<{ name: string; html: SafeHtml }> = [];
    Object.entries(dept || {}).forEach(([name, value]) => {
      out.push({
        name,
        html: this.sanitizeHtml(this.textToBullets(value || "")),
      });
    });
    return out;
  }

  trackByDept = (_: number, item: { name: string }) => item.name;

  /* ---------------- Rendering helpers ---------------- */

  /** Parse summary or dept summary into proper lists with bold text */
  private textToBullets(text: string): string {
    const lines = (text || "").split(/\r?\n/);

    let html = "";
    let inOl = false;
    let inUl = false;

    const closeLists = () => {
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
      if (inUl) {
        html += "</ul>";
        inUl = false;
      }
    };

    const boldify = (s: string) =>
      this.escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      // Numbered list (1., 2., ...)
      if (/^\d+\.\s+/.test(line)) {
        if (!inOl) {
          closeLists();
          html += "<ol>";
          inOl = true;
        }
        html += `<li>${boldify(line.replace(/^\d+\.\s+/, ""))}</li>`;
        continue;
      }

      // Bullet list (* text)
      if (/^\*\s+/.test(line)) {
        if (!inUl) {
          closeLists();
          html += "<ul>";
          inUl = true;
        }
        html += `<li>${boldify(line.replace(/^\*\s+/, ""))}</li>`;
        continue;
      }

      // Plain paragraph line
      closeLists();
      html += `<p>${boldify(line)}</p>`;
    }

    closeLists();
    return html;
  }

  /** Convert plain text (with blank lines) into <p> paragraphs and support **bold** */
  private textToParagraphs(text: string): string {
    const esc = this.escapeHtml(text || "");
    const withBold = esc.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return withBold
      .split(/\n{2,}/) // blank line -> new paragraph
      .map((chunk) => `<p>${chunk.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }
  private escapeAndBold(s: string): string {
    return this.escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  /** Turn AI 'actionable_items' string into nested UL/LI with bold labels */
  /** Build nested UL/LI where **Section:** is a header and following bullets belong to it */
  private actionablesToHtml(text: string): string {
    const lines = (text || "").split(/\r?\n/);

    let html = "";
    let openTop = false; // <ul> (top level)
    let openSection = false; // currently inside <li><strong>…</strong><ul>…</ul></li>

    const openTopList = () => {
      if (!openTop) {
        html += `<ul class="ai-top">`;
        openTop = true;
      }
    };
    const closeSection = () => {
      if (openSection) {
        html += `</ul></li>`;
        openSection = false;
      }
    };
    const closeAll = () => {
      closeSection();
      if (openTop) {
        html += `</ul>`;
        openTop = false;
      }
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      // Section header: **Something:**   (colon optional in source)
      const section = line.match(/^\*\*([^*]+)\*\*:?\s*$/);
      if (section) {
        openTopList();
        closeSection(); // finish previous section
        const title = this.escapeHtml(section[1].trim());
        html += `<li><strong>${title}:</strong><ul>`; // start nested list for this section
        openSection = true;
        continue;
      }

      // Regular bullets inside/outside a section: "*", "-", or "•"
      if (/^[*\-•]\s+/.test(line)) {
        openTopList();
        const content = this.escapeAndBold(line.replace(/^[*\-•]\s+/, ""));
        if (openSection) {
          html += `<li>${content}</li>`; // nested under current section
        } else {
          html += `<li>${content}</li>`; // top-level bullet (rare case)
        }
        continue;
      }

      // Plus-style sub bullets (“+ …”) – keep as list items under current section if open
      if (/^\+\s+/.test(line)) {
        openTopList();
        const content = this.escapeAndBold(line.replace(/^\+\s+/, ""));
        if (openSection) {
          html += `<li>${content}</li>`;
        } else {
          html += `<li>${content}</li>`;
        }
        continue;
      }

      // Plain text lines – attach as an item under the current section, or a top-level item
      const content = this.escapeAndBold(line);
      openTopList();
      if (openSection) {
        html += `<li>${content}</li>`;
      } else {
        html += `<li>${content}</li>`;
      }
    }

    closeAll();
    return html;
  }

  private sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeHtml(text: string): string {
    return (text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
