package com.studentapp.controller;

import com.studentapp.repository.CourseRepository;
import com.studentapp.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public DashboardController(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalEnrollments = studentRepository.findAll()
                .stream()
                .mapToLong(s -> s.getCourses().size())
                .sum();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalCourses", totalCourses);
        stats.put("totalEnrollments", totalEnrollments);

        return ResponseEntity.ok(stats);
    }
}
