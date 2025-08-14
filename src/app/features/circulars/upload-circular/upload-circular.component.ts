import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CircularService } from "../../../core/services/circular.service";
import { CreateCircularRequest } from "../../../core/models/api.model";

@Component({
  selector: "app-upload-circular",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./upload-circular.component.html",
  styleUrl: "./upload-circular.component.css",
})
export class UploadCircularComponent {
  // Tabs
  activeTab: "manual" | "ai" = "manual";

  // Manual form
  uploadForm: FormGroup;
  isSubmitting = false;
  uploadError: string | null = null;
  selectedFiles: File[] = [];

  // AI flow
  aiFile: File | null = null;
  aiIsExtracting = false;
  aiResult: {
    summary: string;
    actionable_items: string;
    department_summary: string;
  } | null = null;

  // Rendered, safe HTML
  summaryHtml: SafeHtml = "";
  actionablesHtml: SafeHtml = "";
  deptSummaryHtml: SafeHtml = "";

  // Minimal meta form for saving AI result as circular
  metaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private circularService: CircularService
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

    this.metaForm = this.fb.group({
      title: ["", Validators.required],
      regulatoryBody: ["RBI", Validators.required],
      category: ["Compliance", Validators.required],
      priority: ["HIGH", Validators.required],
      issuedDate: ["", Validators.required],
      effectiveDate: ["", Validators.required],
      referenceNumber: [""],
    });
  }

  /* ---------------- Tabs ---------------- */
  setTab(tab: "manual" | "ai") {
    this.activeTab = tab;
  }

  /* ---------------- Manual Upload ---------------- */
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  resetForm() {
    this.uploadForm.reset();
    this.selectedFiles = [];
    this.uploadError = null;
  }

  onSubmitManual() {
    if (this.uploadForm.invalid) return;

    this.isSubmitting = true;
    this.uploadError = null;

    // Build payload (attachments are files in a real API)
    const payload: CreateCircularRequest = {
      referenceNumber: this.uploadForm.value.referenceNumber,
      regulatoryBody: this.uploadForm.value.regulatoryBody,
      title: this.uploadForm.value.title,
      description: this.uploadForm.value.description,
      category: this.uploadForm.value.category,
      priority: this.uploadForm.value.priority,
      issuedDate: this.uploadForm.value.issuedDate,
      effectiveDate: this.uploadForm.value.effectiveDate,
      content: this.uploadForm.value.content,
      attachments: this.selectedFiles, // expects File[]
    };

    this.circularService.createCircular(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res?.data?.id) {
          this.router.navigate(["/circulars", res.data.id]);
        } else {
          this.router.navigate(["/circulars"]);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.uploadError =
          (err && (err.message || String(err))) || "Upload failed";
      },
    });
  }

  /* ---------------- AI Extract ---------------- */
  onAIFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.aiFile = input.files?.[0] ?? null;
  }

  runAIExtract() {
    if (!this.aiFile) return;

    // Simulate API call for demo — swap this with your real endpoint
    this.aiIsExtracting = true;
    setTimeout(() => {
      this.aiResult = {
        summary:
          "The document is a circular issued by the Reserve Bank of India (RBI) to all scheduled commercial banks, local area banks, and small finance banks in India. The circular outlines the guidelines for compliance functions in banks and the role of Chief Compliance Officer (CCO).\n\nThe main points of the circular are:\n\n1. Banks must have an effective compliance culture, independent corporate compliance function, and strong compliance risk management programme.\n2. A CCO should be appointed by a bank to manage compliance risk effectively. The CCO should have a minimum fixed tenure of 3 years and should not be removed or transferred without explicit prior approval of the Board.\n3. Eligibility criteria for appointment as CCO include:\n\t* Rank: Senior executive with at least General Manager rank\n\t* Age: Not more than 55 years\n\t* Experience: At least 15 years in banking or financial services, with minimum 5 years in Audit/Finance/Compliance/Legal/Risk Management functions\n\t* Skills: Good understanding of industry and risk management, knowledge of regulations and legal framework\n4. The selection process for CCO should be done through a well-defined selection committee constituted by the Board.\n5. Reporting requirements include:\n\t* Prior intimation to RBI before appointment or removal of CCO\n\t* Detailed profile of candidate along with fit and proper certification by MD & CEO\n6. The CCO's reporting line is direct to MD & CEO and/or Board/Board Committee (ACB).\n7. Authority: The CCO has the authority to communicate with any staff member, access all records or files necessary for compliance issues, and report promptly to the Board/ACB/MD & CEO.\n8. Duties and responsibilities of the compliance function include:\n\t* Apprising the Board and senior management on regulations, rules, and standards\n\t* Conducting assessments of compliance risk and developing risk-oriented activity plans\n\t* Reporting on compliance failures/breaches to the Board/ACB/MD & CEO\n9. Internal audit: The compliance function should be subject to internal audit.\n10. Dual hatting: The CCO should not have any role that brings elements of conflict of interest, except in banks where proportionality is justified.\n\nThe circular also emphasizes the importance of an independent compliance function and adherence to the bank's compliance policy. Any new appointment will be governed by these instructions, while existing COOs may reappoint their current incumbent if they meet the requirements within a period of six months.",
        actionable_items:
          "Here are the actionable instructions or policy changes extracted from the document in a clear and crisp bullet format:\n\n• **Policy**: A bank must lay down a Board-approved compliance policy that:\n\t+ Clearly spells out its compliance philosophy\n\t+ Outlines Tone from the Top, Accountability, Incentive Structure, and Effective Communication & Challenges\n\t+ Covers structure and role of the compliance function\n\t+ Sets processes for identifying, assessing, monitoring, managing, and reporting on compliance risk throughout the bank\n\t+ Is reviewed at least once a year\n\n• **Tenor for appointment of CCO**: The CCO must be appointed for a minimum fixed tenure of not less than 3 years.\n\n• **Transfer/Removal of CCO**: The CCO may be transferred or removed before completion of tenure only in exceptional circumstances with explicit prior approval of the Board after following a well-defined and transparent internal administrative procedure.\n\n• **Eligibility Criteria for appointment as CCO**:\n\t+ Rank: Senior executive of the bank, preferably in the rank of General Manager or an equivalent position\n\t+ Age: Not more than 55 years\n\t+ Experience: At least 15 years in banking or financial services, with minimum 5 years in Audit/Finance/Compliance/Legal/Risk Management functions\n\t+ Skills: Good understanding of industry and risk management, knowledge of regulations, legal framework, and sensitivity to supervisors' expectations\n\t+ Stature: Ability to independently exercise judgement\n\n• **Selection Process**: The selection process for the CCO must be done on the basis of a well-defined selection process and recommendations made by the senior executive-level selection committee constituted by the Board.\n\n• **Reporting Requirements**: A prior intimation must be provided to the Department of Supervision, Reserve Bank of India, before appointment, premature transfer/removal of the CCO. The information should include a detailed profile of the candidate along with fit and proper certification by the MD & CEO of the bank.\n\n• **Reporting Line**: The CCO must have direct reporting lines to the MD & CEO and/or Board/Board Committee (ACB) of the bank.\n\n• **Authority**: The CCO and compliance function must have the authority to communicate with any staff member and have access to all records or files necessary to enable them to carry out entrusted responsibilities in respect of compliance issues.\n\n• **Duties and Responsibilities of Compliance Function**:\n\t+ To apprise the Board and senior management on regulations, rules, and standards\n\t+ To provide clarification on any compliance-related issues\n\t+ To conduct assessment of compliance risk (at least once a year)\n\t+ To report promptly to the Board/ACB/MD & CEO about any major changes or observations relating to compliance risk\n\t+ To periodically report on compliance failures/breaches to the Board/ACB and circulating to the concerned functional heads\n\n• **Internal Audit**: The compliance function must be subject to internal audit.\n\n• **Dual Hatting**: There shall not be any dual hatting, i.e., the CCO should not be given any responsibility that brings elements of conflict of interest, especially roles relating to business.\n\n• **The CCO shall not be member of any committee which brings his/her role in conflict with responsibility as member of the committee**",
        department_summary:
          'Summary related to the "string" department:\n\nNo summary/instruction to this department.',
      };

      // Convert each section to pretty HTML
      this.summaryHtml = this.sanitizeHtml(
        this.textToParagraphs(this.aiResult.summary)
      );
      this.actionablesHtml = this.sanitizeHtml(
        this.actionablesToHtml(this.aiResult.actionable_items)
      );
      this.deptSummaryHtml = this.sanitizeHtml(
        this.textToParagraphs(this.aiResult.department_summary)
      );

      // Pre-fill meta form with a decent default
      this.metaForm.patchValue({
        title: "RBI Guidelines on Compliance & CCO",
        regulatoryBody: "RBI",
        category: "Compliance",
        priority: "HIGH",
      });

      this.aiIsExtracting = false;
    }, 1200);
  }

  saveExtractAsCircular() {
    if (!this.aiResult || this.metaForm.invalid) return;

    this.isSubmitting = true;

    const body: CreateCircularRequest = {
      referenceNumber:
        this.metaForm.value.referenceNumber || `AUTO-${Date.now()}`,
      regulatoryBody: this.metaForm.value.regulatoryBody,
      title: this.metaForm.value.title,
      description: this.aiResult.summary.slice(0, 240) + "…",
      category: this.metaForm.value.category,
      priority: this.metaForm.value.priority,
      issuedDate: this.metaForm.value.issuedDate,
      effectiveDate: this.metaForm.value.effectiveDate,
      content: [
        "# Summary",
        this.aiResult.summary,
        "",
        "# Actionable Items",
        this.aiResult.actionable_items,
        "",
        "# Department Summary",
        this.aiResult.department_summary,
      ].join("\n"),
      attachments: this.aiFile ? [this.aiFile] : [],
    };

    this.circularService.createCircular(body).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res?.data?.id) {
          this.router.navigate(["/circulars", res.data.id]);
        }
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  /* ---------------- Rendering helpers ---------------- */

  /** Convert plain text (with blank lines) into <p> paragraphs and support **bold** */
  private textToParagraphs(text: string): string {
    const esc = this.escapeHtml(text || "");
    const withBold = esc.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Split on blank lines to paragraphs
    return withBold
      .split(/\n{2,}/)
      .map((chunk) => `<p>${chunk.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  /** Turn the AI 'actionable_items' string into nested UL/LI with bold labels */
  private actionablesToHtml(text: string): string {
    const lines = (text || "").split("\n");

    let html = "";
    let inTopList = false;
    let inSubList = false;

    const flushOpenLists = () => {
      if (inSubList) {
        html += "</ul>";
        inSubList = false;
      }
      if (inTopList) {
        html += "</ul>";
        inTopList = false;
      }
    };

    const openTop = () => {
      if (!inTopList) {
        html += `<ul>`;
        inTopList = true;
      }
    };
    const openSub = () => {
      if (!inSubList) {
        html += `<ul>`;
        inSubList = true;
      }
    };

    const b = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    for (const raw of lines) {
      const line = raw.trimRight();

      // top bullet: starts with • / * / -
      if (/^([•\-\*])\s+/.test(line)) {
        openTop();
        // Close sublist if we were in one
        if (inSubList) {
          html += "</ul>";
          inSubList = false;
        }
        const content = b(this.escapeHtml(line.replace(/^([•\-\*])\s+/, "")));
        html += `<li>${content}</li>`;
        continue;
      }

      // sub bullet: starts with '+' (or '•' preceded by indentation)
      if (/^\+[\s]+/.test(line)) {
        openTop();
        openSub();
        const content = b(this.escapeHtml(line.replace(/^\+[\s]+/, "")));
        html += `<li>${content}</li>`;
        continue;
      }

      // blank -> paragraph break within current context
      if (line.trim() === "") {
        continue;
      }

      // Normal text line — attach as paragraph between lists
      flushOpenLists();
      html += `<p>${b(this.escapeHtml(line))}</p>`;
    }

    flushOpenLists();
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
