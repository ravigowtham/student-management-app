package com.studentapp.service;

import com.studentapp.dto.CourseDTO;
import com.studentapp.entity.Course;
import com.studentapp.exception.BusinessException;
import com.studentapp.exception.DuplicateResourceException;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> getAllCourses() {
        log.info("Fetching all courses");
        return courseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        log.info("Fetching course with id: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return toDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO dto) {
        log.info("Creating course with code: {}", dto.getCourseCode());
        if (courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new DuplicateResourceException("A course with this code already exists");
        }

        Course course = toEntity(dto);
        Course saved = courseRepository.save(course);
        log.info("Course created with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        log.info("Updating course with id: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        course.setCourseName(dto.getCourseName());
        course.setCourseCode(dto.getCourseCode());
        course.setDescription(dto.getDescription());
        course.setCredits(dto.getCredits());
        course.setMaxCapacity(dto.getMaxCapacity());
        course.setInstructor(dto.getInstructor());

        Course saved = courseRepository.save(course);
        log.info("Course updated with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteCourse(Long id) {
        log.info("Deleting course with id: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (!course.getStudents().isEmpty()) {
            throw new BusinessException("Cannot delete course with " + course.getStudents().size()
                    + " enrolled student(s). Please unenroll all students first.");
        }

        courseRepository.deleteById(id);
        log.info("Course deleted with id: {}", id);
    }

    // --- Mapping helpers ---

    private CourseDTO toDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .maxCapacity(course.getMaxCapacity())
                .instructor(course.getInstructor())
                .enrolledCount(course.getStudents() != null ? course.getStudents().size() : 0)
                .build();
    }

    private Course toEntity(CourseDTO dto) {
        return Course.builder()
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .description(dto.getDescription())
                .credits(dto.getCredits())
                .maxCapacity(dto.getMaxCapacity())
                .instructor(dto.getInstructor())
                .build();
    }
}
