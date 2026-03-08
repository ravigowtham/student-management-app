import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, EnrollmentRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = '/api/students';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  enroll(request: EnrollmentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/enroll`, request);
  }

  unenroll(request: EnrollmentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/unenroll`, request);
  }

  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/by-course/${courseId}`);
  }
}
