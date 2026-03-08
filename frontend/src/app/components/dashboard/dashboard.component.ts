import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Overview of your student management system</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon students">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.totalStudents ?? '—' }}</div>
            <div class="stat-label">Total Students</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon courses">
            <span class="material-icons">menu_book</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.totalCourses ?? '—' }}</div>
            <div class="stat-label">Total Courses</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon enrollments">
            <span class="material-icons">how_to_reg</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats?.totalEnrollments ?? '—' }}</div>
            <div class="stat-label">Total Enrollments</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon avg">
            <span class="material-icons">bar_chart</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ avgEnrollmentsPerStudent }}</div>
            <div class="stat-label">Avg Courses / Student</div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error-msg">
        <span class="material-icons">error_outline</span>
        Failed to load stats. Make sure the backend is running.
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1100px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #111928;
      margin: 0 0 0.25rem;
    }

    .page-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 0.9rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon .material-icons { font-size: 1.5rem; }

    .stat-icon.students { background: #eff6ff; color: #3b82f6; }
    .stat-icon.courses  { background: #f0fdf4; color: #22c55e; }
    .stat-icon.enrollments { background: #fef3c7; color: #f59e0b; }
    .stat-icon.avg { background: #fdf4ff; color: #a855f7; }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111928;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 0.3rem;
      font-weight: 500;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: Stats | null = null;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Stats>('/api/dashboard/stats').subscribe({
      next: (data) => this.stats = data,
      error: () => this.error = true
    });
  }

  get avgEnrollmentsPerStudent(): string {
    if (!this.stats || this.stats.totalStudents === 0) return '—';
    return (this.stats.totalEnrollments / this.stats.totalStudents).toFixed(1);
  }
}
