# Student Management System

A full-stack student management application built with **Angular 18+**, **Spring Boot 3**, and **MySQL**.

## Features

- **Student Management** -- Create, update, delete, and search students
- **Course Management** -- Full CRUD for courses with capacity tracking
- **Enrollment** -- Enroll/unenroll students in courses with capacity validation
- **Modal Confirmations** -- Delete actions require user confirmation
- **Error Handling** -- Backend validation, custom exceptions, and frontend toast notifications
- **Multi-component Communication** -- Parent-child data flow via @Input/@Output
- **RxJS Observables** -- State handled via RxJS in Angular services

---

## Architecture

```
student-management-app/
├── backend/                    # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/studentapp/
│       │   ├── config/         # CORS + Global Exception Handler
│       │   ├── controller/     # REST endpoints
│       │   ├── dto/            # Data Transfer Objects (with validation)
│       │   ├── entity/         # JPA Entities (Student, Course, ManyToMany)
│       │   ├── exception/      # Custom exceptions (ResourceNotFound, Duplicate, Business)
│       │   ├── repository/     # Spring Data JPA repositories
│       │   └── service/        # Business logic with @Transactional
│       └── resources/
│           └── application.properties
│
└── frontend/                   # Angular 18+ SPA
    └── src/app/
        ├── components/         # Standalone components
        │   ├── student-list/   # Student table with search
        │   ├── student-form/   # Student create/edit modal
        │   ├── course-list/    # Course card grid
        │   ├── course-form/    # Course create/edit modal
        │   └── enrollment/     # Enroll/unenroll + view by course
        ├── models/             # TypeScript interfaces
        └── services/           # HTTP services using RxJS Observables
```

---

## Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm 9+**
- **Angular CLI 18+** (`npm install -g @angular/cli`)
- **MySQL 8+** (running locally)

> The app connects to a local MySQL instance. The database `studentdb` is created automatically if it doesn't exist.
>
> Before running the backend, update the `backend/.env` file with your MySQL credentials:
> ```
> MYSQL_USERNAME=your_mysql_username
> MYSQL_PASSWORD=your_mysql_password
> ```
> If your MySQL uses the default `root` user with no password, you can leave `MYSQL_PASSWORD` empty.

---

## Running the Backend

```bash
cd student-management-app/backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`.

### API Endpoints

| Method | Endpoint                         | Description                  |
|--------|----------------------------------|------------------------------|
| GET    | `/api/students`                  | List all students            |
| GET    | `/api/students/{id}`             | Get student by ID            |
| POST   | `/api/students`                  | Create a student             |
| PUT    | `/api/students/{id}`             | Update a student             |
| DELETE | `/api/students/{id}`             | Delete a student             |
| POST   | `/api/students/enroll`           | Enroll student in course     |
| POST   | `/api/students/unenroll`         | Unenroll student from course |
| GET    | `/api/students/by-course/{id}`   | Students in a course         |
| GET    | `/api/courses`                   | List all courses             |
| GET    | `/api/courses/{id}`              | Get course by ID             |
| POST   | `/api/courses`                   | Create a course              |
| PUT    | `/api/courses/{id}`              | Update a course              |
| DELETE | `/api/courses/{id}`              | Delete a course              |

---

## Running the Frontend

```bash
cd student-management-app/frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

The dev server proxies `/api` requests to `http://localhost:8080` via `proxy.conf.json`.

---

## Running Backend Tests

```bash
cd student-management-app/backend
mvn test
```

Unit tests cover:
- **StudentService** -- CRUD operations, enrollment logic, duplicate/not-found handling
- **CourseService** -- CRUD operations, duplicate code detection
- **StudentController** -- REST endpoint responses, validation errors, 404 handling
- **CourseController** -- REST endpoint responses, validation errors, 404 handling

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | Angular 18+, TypeScript, RxJS |
| Backend    | Spring Boot 3.3, Java 17   |
| Database   | MySQL 8+                    |
| ORM        | Hibernate / Spring Data JPA |
| Validation | Jakarta Bean Validation     |
| Testing    | JUnit 5, Mockito, MockMvc  |
| Build      | Maven, Angular CLI          |
