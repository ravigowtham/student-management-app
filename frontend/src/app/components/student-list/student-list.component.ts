import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/models';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentFormComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Students</h2>
        <button class="btn btn-primary" (click)="openForm()">
          <span class="material-icons">add</span> Add Student
        </button>
      </div>

      <!-- Search -->
      <div class="card" style="margin-bottom: 1.25rem; padding: 0.85rem 1.25rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="material-icons" style="color:var(--text-muted); font-size:1.2rem;">search</span>
          <input
            class="form-control"
            style="border:none; box-shadow:none; padding:0.3rem 0;"
            placeholder="Search students..."
            [(ngModel)]="searchTerm"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div *ngIf="isLoading" style="display:flex;justify-content:center;padding:2rem;">
          <span class="material-icons" style="animation:spin 1s linear infinite;font-size:2rem;color:var(--primary);">autorenew</span>
        </div>
        <div class="table-container" *ngIf="!isLoading && filteredStudents.length > 0; else emptyState">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents">
                <td>
                  <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--primary);">
                    {{ student.studentId }}
                  </span>
                </td>
                <td style="font-weight: 600;">{{ student.firstName }} {{ student.lastName }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.phone || '—' }}</td>
                <td>
                  <span class="badge badge-primary">
                    {{ student.courseIds?.length || 0 }} enrolled
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="btn btn-outline btn-sm" (click)="openForm(student)" title="Edit">
                      <span class="material-icons" style="font-size:1rem;">edit</span>
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="confirmDelete(student)" title="Delete">
                      <span class="material-icons" style="font-size:1rem;">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <span class="material-icons">people_outline</span>
            <p>No students found. Add your first student to get started.</p>
          </div>
        </ng-template>
      </div>

      <!-- Form Modal -->
      <app-student-form
        *ngIf="showForm"
        [student]="selectedStudent"
        (save)="onSave($event)"
        (close)="showForm = false"
      ></app-student-form>

      <!-- Delete Confirmation -->
      <div class="modal-overlay" *ngIf="showDeleteConfirm" (click)="showDeleteConfirm = false">
        <div class="modal-content" (click)="$event.stopPropagation()" style="max-width: 400px;">
          <div class="modal-header">
            <h3>Delete Student</h3>
          </div>
          <p style="color: var(--text-secondary);">
            Are you sure you want to delete
            <strong>{{ studentToDelete?.firstName }} {{ studentToDelete?.lastName }}</strong>?
            This action cannot be undone.
          </p>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showDeleteConfirm = false">Cancel</button>
            <button class="btn btn-danger" (click)="deleteStudent()">Delete</button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="toast" [ngClass]="toast.type === 'success' ? 'toast-success' : 'toast-error'">
        {{ toast.message }}
      </div>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  searchTerm = '';
  showForm = false;
  selectedStudent: Student | null = null;
  showDeleteConfirm = false;
  studentToDelete: Student | null = null;
  toast: { message: string; type: string } | null = null;
  isLoading = false;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  get filteredStudents(): Student[] {
    if (!this.searchTerm) return this.students;
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.firstName.toLowerCase().includes(term) ||
      s.lastName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      (s.studentId && s.studentId.toLowerCase().includes(term))
    );
  }

  loadStudents() {
    this.isLoading = true;
    this.studentService.getAll().subscribe({
      next: (data) => { this.students = data; this.isLoading = false; },
      error: () => { this.showToast('Failed to load students', 'error'); this.isLoading = false; }
    });
  }

  openForm(student?: Student) {
    this.selectedStudent = student || null;
    this.showForm = true;
  }

  onSave(student: Student) {
    const op = student.id
      ? this.studentService.update(student.id, student)
      : this.studentService.create(student);

    op.subscribe({
      next: () => {
        this.showForm = false;
        this.loadStudents();
        this.showToast(student.id ? 'Student updated' : 'Student created', 'success');
      },
      error: (err) => {
        const msg = err.error?.message || 'Operation failed';
        this.showToast(msg, 'error');
      }
    });
  }

  confirmDelete(student: Student) {
    this.studentToDelete = student;
    this.showDeleteConfirm = true;
  }

  deleteStudent() {
    if (!this.studentToDelete?.id) return;
    this.studentService.delete(this.studentToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.loadStudents();
        this.showToast('Student deleted', 'success');
      },
      error: () => this.showToast('Failed to delete student', 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
