import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/models';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseFormComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Courses</h2>
        <button class="btn btn-primary" (click)="openForm()">
          <span class="material-icons">add</span> Add Course
        </button>
      </div>

      <div *ngIf="isLoading" style="display:flex;justify-content:center;padding:2rem;">
        <span class="material-icons" style="animation:spin 1s linear infinite;font-size:2rem;color:var(--primary);">autorenew</span>
      </div>

      <div class="courses-grid" *ngIf="!isLoading && courses.length > 0; else emptyState">
        <div class="course-card card" *ngFor="let course of courses">
          <div class="course-card-header">
            <span class="course-code">{{ course.courseCode }}</span>
            <div class="actions-cell">
              <button class="btn btn-icon btn-outline" (click)="openForm(course)" title="Edit">
                <span class="material-icons" style="font-size:1rem;">edit</span>
              </button>
              <button class="btn btn-icon btn-outline" style="color:var(--danger);" (click)="confirmDelete(course)" title="Delete">
                <span class="material-icons" style="font-size:1rem;">delete</span>
              </button>
            </div>
          </div>
          <h3 class="course-name">{{ course.courseName }}</h3>
          <p class="course-desc" *ngIf="course.description">{{ course.description }}</p>
          <div class="course-meta">
            <div class="meta-item">
              <span class="material-icons">star</span>
              {{ course.credits }} credits
            </div>
            <div class="meta-item" *ngIf="course.instructor">
              <span class="material-icons">person</span>
              {{ course.instructor }}
            </div>
            <div class="meta-item">
              <span class="material-icons">group</span>
              {{ course.enrolledCount || 0 }}{{ course.maxCapacity ? '/' + course.maxCapacity : '' }} enrolled
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="card">
          <div class="empty-state">
            <span class="material-icons">menu_book</span>
            <p>No courses yet. Create your first course to get started.</p>
          </div>
        </div>
      </ng-template>

      <app-course-form
        *ngIf="showForm"
        [course]="selectedCourse"
        (save)="onSave($event)"
        (close)="showForm = false"
      ></app-course-form>

      <div class="modal-overlay" *ngIf="showDeleteConfirm" (click)="showDeleteConfirm = false">
        <div class="modal-content" (click)="$event.stopPropagation()" style="max-width: 400px;">
          <div class="modal-header"><h3>Delete Course</h3></div>
          <p style="color: var(--text-secondary);">
            Delete <strong>{{ courseToDelete?.courseName }}</strong>? This will also remove all enrollments.
          </p>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showDeleteConfirm = false">Cancel</button>
            <button class="btn btn-danger" (click)="deleteCourse()">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="toast" class="toast" [ngClass]="toast.type === 'success' ? 'toast-success' : 'toast-error'">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
    }
    .course-card { transition: box-shadow 0.15s ease; }
    .course-card:hover { box-shadow: var(--shadow-md); }
    .course-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.65rem;
    }
    .course-code {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary);
      background: var(--primary-light);
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
    }
    .course-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    .course-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .course-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid var(--border);
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .meta-item .material-icons { font-size: 1rem; }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  showForm = false;
  selectedCourse: Course | null = null;
  showDeleteConfirm = false;
  courseToDelete: Course | null = null;
  toast: { message: string; type: string } | null = null;
  isLoading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.getAll().subscribe({
      next: (data) => { this.courses = data; this.isLoading = false; },
      error: () => { this.showToast('Failed to load courses', 'error'); this.isLoading = false; }
    });
  }

  openForm(course?: Course) {
    this.selectedCourse = course || null;
    this.showForm = true;
  }

  onSave(course: Course) {
    const op = course.id
      ? this.courseService.update(course.id, course)
      : this.courseService.create(course);

    op.subscribe({
      next: () => {
        this.showForm = false;
        this.loadCourses();
        this.showToast(course.id ? 'Course updated' : 'Course created', 'success');
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Operation failed', 'error');
      }
    });
  }

  confirmDelete(course: Course) {
    this.courseToDelete = course;
    this.showDeleteConfirm = true;
  }

  deleteCourse() {
    if (!this.courseToDelete?.id) return;
    this.courseService.delete(this.courseToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.loadCourses();
        this.showToast('Course deleted', 'success');
      },
      error: () => this.showToast('Failed to delete course', 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
