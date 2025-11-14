import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-instructions-panel",
  imports: [],
  templateUrl: "./instructions-panel.component.html",
  styleUrl: "./instructions-panel.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsPanel {
  downloadSampleFiles(): void {
    const url = "assets/AIComplianceSampleDocuments.zip";
    const a = document.createElement("a");
    a.href = url;
    a.download = "AIComplianceSampleDocuments.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log("Download sample files clicked");
  }
}
