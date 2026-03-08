export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  studentId?: string;
  courseIds?: number[];
}

export interface Course {
  id?: number;
  courseCode: string;
  courseName: string;
  description?: string;
  credits: number;
  maxCapacity?: number;
  instructor?: string;
  enrolledCount?: number;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
}

export interface ApiError {
  timestamp: string;
  message: string;
  status: number;
  errors?: { [key: string]: string };
}
