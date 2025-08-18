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

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
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

    setTimeout(() => {
      this.aiResult = {
        summary:
          "The document is a circular issued by the Reserve Bank of India (RBI) to all scheduled commercial banks, local area banks, and small finance banks regarding compliance functions in banks and the role of Chief Compliance Officer (CCO). The circular aims to bring uniformity in approach followed by banks in this regard.\n\nKey points from the document are:\n\n1. Banks are required to have an effective compliance culture, independent corporate compliance function, and strong compliance risk management program at bank and group levels.\n2. The CCO should be a senior executive with a minimum of 15 years' experience in banking or financial services, and possess certain skills and stature.\n3. The selection process for the CCO should be done through a well-defined selection committee constituted by the Board.\n4. The CCO should have direct reporting lines to the MD & CEO and/or the Board/Board Committee (ACB).\n5. The compliance function should have the authority to communicate with any staff member, access all records or files necessary for compliance issues, and report promptly to the Board/ACB/MD & CEO about major changes or observations relating to compliance risk.\n6. The duties and responsibilities of the compliance function include conducting assessments of compliance risk, developing risk-oriented activity plans, reporting on compliance failures/breaches, monitoring and testing compliance, examining sustenance of compliance, and ensuring compliance with supervisory observations made by RBI.\n7. Internal audit should be conducted on the compliance function.\n8. There should be no \"dual hatting\" or conflict of interest in the role of the CCO.\n9. The bank's Board of Directors is overall responsible for overseeing the effective management of the bank's compliance function and compliance risk.\n\nThe circular will come into effect immediately, and any new appointment shall be governed by the instructions contained herein. Existing CCOs may follow the indicated processes within a period of six months to ensure their appointment meets the requirements.",
        actionable_items:
          "Here are the actionable instructions or policy changes extracted from the document, organized by department:\n\n**Compliance:**\n\n* A bank shall lay down a Board-approved compliance policy clearly spelling out its compliance philosophy, expectations on compliance culture, structure and role of the compliance function, and processes for identifying, assessing, monitoring, managing, and reporting on compliance risk throughout the bank.\n* The bank shall develop and maintain a quality assurance and improvement program covering all aspects of the compliance function, subject to independent external review periodically (at least once in three years).\n\n**Risk Management:**\n\n* Banks are required to have an effective compliance risk management programme at bank and group level.\n\n**No actionable items for these departments:**\nAdministration, Operations, IT Security, Finance, Human Resources",
        department_summary: {
          Administration: "No summary/instruction to this department.",
          Compliance:
            "Summary for the Compliance department:\n\nAs part of a robust compliance system, banks are required to have an effective compliance culture, independent corporate compliance function, and strong compliance risk management program. The Chief Compliance Officer (CCO) is responsible for managing compliance risk effectively.\n\nThe guidelines emphasize the importance of having a Board-approved compliance policy that clearly outlines the bank's compliance philosophy, expectations on compliance culture, structure and role of the compliance function, and processes for identifying, assessing, monitoring, and reporting on compliance risk. The policy should also reflect the size, complexity, and compliance risk profile of the bank.\n\nAdditionally, the guidelines stress the need to develop and maintain a quality assurance and improvement program covering all aspects of the compliance function, which shall be subject to independent external review periodically (at least once in three years).",
          "Risk Management":
            'Summary for the "Risk Management" department:\n\n* Banks are required to have an effective compliance risk management program at bank and group level, which includes identifying, assessing, monitoring, managing, and reporting on compliance risks throughout the bank.\n* The compliance risk management program should reflect the size, complexity, and compliance risk profile of the bank, as well as ensure compliance with all applicable statutory provisions, rules, and regulations.\n\nNo summary/instruction to this department.',
          Operations:
            'Summary related to the "Operations" department:\n\nNo summary/instruction to this department.',
          "IT Security": "No summary/instruction to this department.",
          Finance:
            'Summary related to the "Finance" department:\n\nNo summary/instruction to this department.',
          "Human Resources": "No summary/instruction to this department.",
        },
      };
      // ---------------------------------------------------------------

      // Build rendered HTML sections
      this.summaryHtml = this.sanitizeHtml(
        this.textToParagraphs(this.aiResult.summary)
      );
      this.actionablesHtml = this.sanitizeHtml(
        this.actionablesToHtml(this.aiResult.actionable_items)
      );

      // Build department-wise entries (cards)
      this.departmentEntries = this.buildDepartmentEntries(
        this.aiResult.department_summary
      );

      this.aiIsExtracting = false;
    }, 900);
  }

  /* ---------------- Department helpers ---------------- */

  private buildDepartmentEntries(
    dept: Record<string, string> | undefined | null
  ): Array<{ name: string; html: SafeHtml }> {
    const out: Array<{ name: string; html: SafeHtml }> = [];
    Object.entries(dept || {}).forEach(([name, value]) => {
      out.push({
        name,
        html: this.sanitizeHtml(this.textToParagraphs(value || "")),
      });
    });
    return out;
  }

  trackByDept = (_: number, item: { name: string }) => item.name;

  /* ---------------- Rendering helpers ---------------- */

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
