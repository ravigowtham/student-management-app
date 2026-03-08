import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Course' : 'Create New Course' }}</h3>
          <button class="btn btn-icon btn-outline" (click)="close.emit()">
            <span class="material-icons" style="font-size:1.1rem;">close</span>
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Course Code *</label>
            <input
              class="form-control"
              [(ngModel)]="form.courseCode"
              placeholder="e.g. CS101"
              [class.ng-invalid]="submitted && !form.courseCode"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && !form.courseCode">Course code is required</div>
          </div>
          <div class="form-group">
            <label>Credits *</label>
            <input
              class="form-control"
              type="number"
              min="1"
              max="12"
              [(ngModel)]="form.credits"
              [class.ng-invalid]="submitted && !form.credits"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && !form.credits">Credits required (1-12)</div>
          </div>
        </div>

        <div class="form-group">
          <label>Course Name *</label>
          <input
            class="form-control"
            [(ngModel)]="form.courseName"
            placeholder="e.g. Introduction to Computer Science"
            [class.ng-invalid]="submitted && !form.courseName"
            [class.ng-touched]="submitted"
          />
          <div class="form-error" *ngIf="submitted && !form.courseName">Course name is required</div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            class="form-control"
            [(ngModel)]="form.description"
            rows="3"
            placeholder="Brief course description..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Instructor</label>
            <input
              class="form-control"
              [(ngModel)]="form.instructor"
              placeholder="e.g. Dr. Smith"
            />
          </div>
          <div class="form-group">
            <label>Max Capacity</label>
            <input
              class="form-control"
              type="number"
              min="1"
              [(ngModel)]="form.maxCapacity"
              placeholder="e.g. 30"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="onSubmit()">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() save = new EventEmitter<Course>();
  @Output() close = new EventEmitter<void>();

  form: Course = {
    courseCode: '',
    courseName: '',
    description: '',
    credits: 3,
    maxCapacity: undefined,
    instructor: ''
  };

  submitted = false;

  get isEdit(): boolean {
    return !!this.course?.id;
  }

  ngOnInit() {
    if (this.course) {
      this.form = { ...this.course };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.courseCode || !this.form.courseName || !this.form.credits) return;
    this.save.emit({ ...this.form });
  }
}
