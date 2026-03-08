import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'enrollment', component: EnrollmentComponent },
  { path: '**', redirectTo: 'students' }
];
