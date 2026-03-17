import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { Student, Course } from '../../models/models';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Course Enrollment</h2>
      </div>

      <div *ngIf="isLoading" style="display:flex;justify-content:center;padding:2rem;">
        <span class="material-icons" style="animation:spin 1s linear infinite;font-size:2rem;color:var(--primary);">autorenew</span>
      </div>

      <div class="card" style="margin-bottom: 1.5rem;" *ngIf="!isLoading">
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 0.4rem; color: var(--primary);">how_to_reg</span>
          Enroll a Student in a Course
        </h3>

        <div class="form-row">
          <div class="form-group">
            <label>Select Student</label>
            <select class="form-control" [(ngModel)]="selectedStudentId">
              <option [ngValue]="null" disabled>-- Choose a student --</option>
              <option *ngFor="let student of students" [ngValue]="student.id">
                {{ student.firstName }} {{ student.lastName }} ({{ student.studentId }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Select Course</label>
            <select class="form-control" [(ngModel)]="selectedCourseId">
              <option [ngValue]="null" disabled>-- Choose a course --</option>
              <option *ngFor="let course of availableCourses" [ngValue]="course.id">
                {{ course.courseCode }} - {{ course.courseName }}
              </option>
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button
            class="btn btn-success"
            [disabled]="!selectedStudentId || !selectedCourseId"
            (click)="enroll()"
          >
            <span class="material-icons" style="font-size: 1rem;">add_circle</span>
            Enroll
          </button>
          <button
            class="btn btn-outline"
            style="color: var(--danger); border-color: var(--danger);"
            [disabled]="!selectedStudentId || !selectedCourseId"
            (click)="unenroll()"
          >
            <span class="material-icons" style="font-size: 1rem;">remove_circle</span>
            Unenroll
          </button>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem;">
          <span class="material-icons" style="vertical-align: middle; margin-right: 0.4rem; color: var(--accent);">groups</span>
          View Enrollment by Course
        </h3>

        <div class="form-group" style="max-width: 400px;">
          <select class="form-control" [(ngModel)]="viewCourseId" (ngModelChange)="loadEnrolledStudents()">
            <option [ngValue]="null">-- Select a course --</option>
            <option *ngFor="let course of courses" [ngValue]="course.id">
              {{ course.courseCode }} - {{ course.courseName }}
            </option>
          </select>
        </div>

        <div *ngIf="viewCourseId && enrolledStudents.length > 0" class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of enrolledStudents">
                <td>
                  <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--primary);">
                    {{ student.studentId }}
                  </span>
                </td>
                <td style="font-weight: 600;">{{ student.firstName }} {{ student.lastName }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" (click)="quickUnenroll(student.id!)">
                    <span class="material-icons" style="font-size: 0.9rem;">person_remove</span>
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="viewCourseId && enrolledStudents.length === 0" class="empty-state" style="padding: 2rem;">
          <span class="material-icons">person_off</span>
          <p>No students enrolled in this course yet.</p>
        </div>
      </div>

      <div *ngIf="toast" class="toast" [ngClass]="toast.type === 'success' ? 'toast-success' : 'toast-error'">
        {{ toast.message }}
      </div>
    </div>
  `
})
export class EnrollmentComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  enrolledStudents: Student[] = [];

  selectedStudentId: number | null = null;
  selectedCourseId: number | null = null;
  viewCourseId: number | null = null;

  toast: { message: string; type: string } | null = null;
  isLoading = false;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.studentService.getAll().subscribe({ next: (d) => this.students = d });
    this.courseService.getAll().subscribe({
      next: (d) => { this.courses = d; this.isLoading = false; },
      error: () => { this.showToast('Failed to load data', 'error'); this.isLoading = false; }
    });
  }

  get availableCourses(): Course[] {
    if (!this.selectedStudentId) return this.courses;
    const student = this.students.find(s => s.id === this.selectedStudentId);
    if (!student) return this.courses;
    return this.courses;
  }

  enroll() {
    if (!this.selectedStudentId || !this.selectedCourseId) return;
    this.studentService.enroll({
      studentId: this.selectedStudentId,
      courseId: this.selectedCourseId
    }).subscribe({
      next: () => {
        this.showToast('Student enrolled successfully', 'success');
        this.loadData();
        if (this.viewCourseId === this.selectedCourseId) {
          this.loadEnrolledStudents();
        }
      },
      error: (err) => this.showToast(err.error?.message || 'Enrollment failed', 'error')
    });
  }

  unenroll() {
    if (!this.selectedStudentId || !this.selectedCourseId) return;
    this.studentService.unenroll({
      studentId: this.selectedStudentId,
      courseId: this.selectedCourseId
    }).subscribe({
      next: () => {
        this.showToast('Student unenrolled successfully', 'success');
        this.loadData();
        if (this.viewCourseId === this.selectedCourseId) {
          this.loadEnrolledStudents();
        }
      },
      error: (err) => this.showToast(err.error?.message || 'Unenrollment failed', 'error')
    });
  }

  loadEnrolledStudents() {
    if (!this.viewCourseId) {
      this.enrolledStudents = [];
      return;
    }
    this.studentService.getStudentsByCourse(this.viewCourseId).subscribe({
      next: (data) => this.enrolledStudents = data,
      error: () => this.showToast('Failed to load enrolled students', 'error')
    });
  }

  quickUnenroll(studentId: number) {
    if (!this.viewCourseId) return;
    this.studentService.unenroll({
      studentId: studentId,
      courseId: this.viewCourseId
    }).subscribe({
      next: () => {
        this.showToast('Student removed from course', 'success');
        this.loadEnrolledStudents();
        this.loadData();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to remove', 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
