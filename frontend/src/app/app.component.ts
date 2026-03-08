import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="material-icons">school</span>
          <span class="brand-text">StudentHub</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="material-icons">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/students" routerLinkActive="active" class="nav-item">
            <span class="material-icons">people</span>
            <span>Students</span>
          </a>
          <a routerLink="/courses" routerLinkActive="active" class="nav-item">
            <span class="material-icons">menu_book</span>
            <span>Courses</span>
          </a>
          <a routerLink="/enrollment" routerLinkActive="active" class="nav-item">
            <span class="material-icons">how_to_reg</span>
            <span>Enrollment</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <span class="version">v1.0.0</span>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 240px;
      background: #111928;
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 1.5rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .sidebar-brand .material-icons {
      font-size: 1.6rem;
      color: #60a5fa;
    }

    .brand-text {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.7rem 0.85rem;
      border-radius: 8px;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.9);
    }

    .nav-item.active {
      background: rgba(96, 165, 250, 0.15);
      color: #60a5fa;
    }

    .nav-item .material-icons {
      font-size: 1.2rem;
    }

    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .version {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.3);
      font-family: var(--font-mono);
    }

    .main-content {
      flex: 1;
      margin-left: 240px;
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .sidebar { width: 64px; }
      .sidebar-brand span:not(.material-icons),
      .nav-item span:not(.material-icons),
      .sidebar-footer { display: none; }
      .sidebar-brand { justify-content: center; padding: 1.25rem 0.5rem; }
      .nav-item { justify-content: center; padding: 0.75rem; }
      .main-content { margin-left: 64px; }
    }
  `]
})
export class AppComponent {}
