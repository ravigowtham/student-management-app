package com.studentapp.controller;

import com.studentapp.dto.EnrollmentDTO;
import com.studentapp.dto.StudentDTO;
import com.studentapp.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO dto) {
        StudentDTO created = studentService.createStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id,
                                                     @Valid @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/enroll")
    public ResponseEntity<StudentDTO> enrollInCourse(@Valid @RequestBody EnrollmentDTO dto) {
        return ResponseEntity.ok(studentService.enrollInCourse(dto.getStudentId(), dto.getCourseId()));
    }

    @PostMapping("/unenroll")
    public ResponseEntity<StudentDTO> unenrollFromCourse(@Valid @RequestBody EnrollmentDTO dto) {
        return ResponseEntity.ok(studentService.unenrollFromCourse(dto.getStudentId(), dto.getCourseId()));
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<StudentDTO>> getStudentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getStudentsByCourse(courseId));
    }
}
