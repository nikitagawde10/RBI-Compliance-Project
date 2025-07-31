import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CircularService } from "../../core/services/circular.service";
import {
  Circular,
  CircularStatus,
  Priority,
} from "../../core/models/circular.model";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormsModule } from "@angular/forms";

interface FilterOptions {
  regulatoryBody: string;
  status: string;
  priority: string;
  searchTerm: string;
}

@Component({
  selector: "app-circulars",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./circulars.component.html",
  styles: [
    `
      .container-fluid {
        max-width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class CircularsComponent implements OnInit {
  circulars$: Observable<Circular[]>;
  filteredCirculars$: Observable<Circular[]>;

  // Filter subjects
  private regulatoryBodyFilter$ = new BehaviorSubject<string>("");
  private statusFilter$ = new BehaviorSubject<string>("");
  private priorityFilter$ = new BehaviorSubject<string>("");
  private searchFilter$ = new BehaviorSubject<string>("");

  // Filter form values
  selectedRegulatoryBody: string = "";
  selectedStatus: string = "";
  selectedPriority: string = "";
  searchTerm: string = "";

  constructor(private circularService: CircularService) {
    // Get all circulars
    this.circulars$ = this.circularService
      .getCirculars()
      .pipe(map((response) => response.data));

    // Setup filtered circulars observable
    this.filteredCirculars$ = combineLatest([
      this.circulars$,
      this.regulatoryBodyFilter$.pipe(startWith("")),
      this.statusFilter$.pipe(startWith("")),
      this.priorityFilter$.pipe(startWith("")),
      this.searchFilter$.pipe(startWith("")),
    ]).pipe(
      map(([circulars, regulatoryBody, status, priority, searchTerm]) => {
        return this.applyFilters(circulars, {
          regulatoryBody,
          status,
          priority,
          searchTerm,
        });
      })
    );
  }

  ngOnInit(): void {}

  // Apply all filters to the circulars array
  private applyFilters(
    circulars: Circular[],
    filters: FilterOptions
  ): Circular[] {
    return circulars.filter((circular) => {
      // Regulatory Body filter
      if (
        filters.regulatoryBody &&
        circular.regulatoryBody !== filters.regulatoryBody
      ) {
        return false;
      }

      // Status filter
      if (filters.status && circular.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && circular.priority !== filters.priority) {
        return false;
      }

      // Search term filter (searches in title, description, and reference number)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          circular.title.toLowerCase().includes(searchLower) ||
          circular.description.toLowerCase().includes(searchLower) ||
          circular.referenceNumber.toLowerCase().includes(searchLower);

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }

  // Filter change handlers
  onRegulatoryBodyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || "";
    this.selectedRegulatoryBody = value;
    this.regulatoryBodyFilter$.next(value);
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || "";
    this.selectedStatus = value;
    this.statusFilter$.next(value);
  }

  onPriorityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target?.value || "";
    this.selectedPriority = value;
    this.priorityFilter$.next(value);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value || "";
    this.searchTerm = value;
    this.searchFilter$.next(value);
  }

  // Direct value setters for programmatic clearing
  setRegulatoryBodyFilter(value: string): void {
    this.selectedRegulatoryBody = value;
    this.regulatoryBodyFilter$.next(value);
  }

  setStatusFilter(value: string): void {
    this.selectedStatus = value;
    this.statusFilter$.next(value);
  }

  setPriorityFilter(value: string): void {
    this.selectedPriority = value;
    this.priorityFilter$.next(value);
  }

  setSearchFilter(value: string): void {
    this.searchTerm = value;
    this.searchFilter$.next(value);
  }

  // Clear all filters
  clearAllFilters(): void {
    this.setRegulatoryBodyFilter("");
    this.setStatusFilter("");
    this.setPriorityFilter("");
    this.setSearchFilter("");
  }

  // Check if any filters are active
  hasActiveFilters(): boolean {
    return !!(
      this.selectedRegulatoryBody ||
      this.selectedStatus ||
      this.selectedPriority ||
      this.searchTerm
    );
  }

  getStatusBadgeClass(status: CircularStatus): string {
    const classes = {
      [CircularStatus.RECEIVED]: "bg-info text-white",
      [CircularStatus.PROCESSING]: "bg-warning text-white",
      [CircularStatus.ASSIGNED]: "bg-primary text-white",
      [CircularStatus.IN_PROGRESS]: "bg-info text-white",
      [CircularStatus.COMPLETED]: "bg-success text-white",
      [CircularStatus.OVERDUE]: "bg-danger text-white",
    };
    return classes[status] || "bg-secondary text-white";
  }

  getPriorityBadgeClass(priority: Priority): string {
    const classes = {
      [Priority.LOW]:
        "bg-success-subtle text-success-emphasis border border-success-subtle",
      [Priority.MEDIUM]:
        "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
      [Priority.HIGH]:
        "bg-danger-subtle text-danger-emphasis border border-danger-subtle",
      [Priority.CRITICAL]: "bg-dark text-white",
    };
    return classes[priority] || "bg-secondary text-white";
  }

  processWithAI(circularId: string) {
    console.log("Processing circular with AI:", circularId);
    // Implement AI processing logic
  }

  assignTasks(circularId: string) {
    console.log("Assigning tasks for circular:", circularId);
    // Implement task assignment logic
  }

  editCircular(circularId: string) {
    console.log("Editing circular:", circularId);
    // Navigate to edit form or open modal
  }

  downloadCircular(circularId: string) {
    console.log("Downloading circular:", circularId);
    // Implement download logic
  }

  shareCircular(circularId: string) {
    console.log("Sharing circular:", circularId);
    // Implement share logic
  }

  deleteCircular(circularId: string) {
    if (confirm("Are you sure you want to delete this circular?")) {
      console.log("Deleting circular:", circularId);
      // Implement delete logic
    }
  }
}
