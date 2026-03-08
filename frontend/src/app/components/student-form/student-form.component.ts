import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Student' : 'Register New Student' }}</h3>
          <button class="btn btn-icon btn-outline" (click)="close.emit()">
            <span class="material-icons" style="font-size:1.1rem;">close</span>
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>First Name *</label>
            <input
              class="form-control"
              [(ngModel)]="form.firstName"
              placeholder="e.g. John"
              [class.ng-invalid]="submitted && !form.firstName"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && !form.firstName">First name is required</div>
          </div>
          <div class="form-group">
            <label>Last Name *</label>
            <input
              class="form-control"
              [(ngModel)]="form.lastName"
              placeholder="e.g. Doe"
              [class.ng-invalid]="submitted && !form.lastName"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && !form.lastName">Last name is required</div>
          </div>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input
            class="form-control"
            type="email"
            [(ngModel)]="form.email"
            placeholder="john.doe@university.edu"
            [class.ng-invalid]="submitted && emailError"
            [class.ng-touched]="submitted"
          />
          <div class="form-error" *ngIf="submitted && emailError">{{ emailError }}</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Phone</label>
            <input
              class="form-control"
              [(ngModel)]="form.phone"
              placeholder="+1 (555) 123-4567"
              [class.ng-invalid]="submitted && phoneError"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && phoneError">{{ phoneError }}</div>
          </div>
          <div class="form-group">
            <label>Date of Birth</label>
            <input
              class="form-control"
              type="date"
              [(ngModel)]="form.dateOfBirth"
              [max]="today"
              [class.ng-invalid]="submitted && dobError"
              [class.ng-touched]="submitted"
            />
            <div class="form-error" *ngIf="submitted && dobError">{{ dobError }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="onSubmit()">
            {{ isEdit ? 'Update' : 'Register' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class StudentFormComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() save = new EventEmitter<Student>();
  @Output() close = new EventEmitter<void>();

  form: Student = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  };

  submitted = false;
  today = new Date().toISOString().split('T')[0];

  get isEdit(): boolean {
    return !!this.student?.id;
  }

  get emailError(): string | null {
    if (!this.form.email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) return 'Enter a valid email address';
    return null;
  }

  get phoneError(): string | null {
    if (!this.form.phone) return null;
    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(this.form.phone)) return 'Enter a valid phone number';
    return null;
  }

  get dobError(): string | null {
    if (!this.form.dateOfBirth) return null;
    if (this.form.dateOfBirth >= this.today) return 'Date of birth must be in the past';
    return null;
  }

  ngOnInit() {
    if (this.student) {
      this.form = { ...this.student };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.firstName || !this.form.lastName || this.emailError || this.phoneError || this.dobError) return;
    this.save.emit({ ...this.form });
  }
}
