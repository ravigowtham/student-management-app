package com.studentapp.service;

import com.studentapp.dto.StudentDTO;
import com.studentapp.entity.Course;
import com.studentapp.entity.Student;
import com.studentapp.exception.BusinessException;
import com.studentapp.exception.DuplicateResourceException;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.repository.CourseRepository;
import com.studentapp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public List<StudentDTO> getAllStudents() {
        log.info("Fetching all students");
        return studentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        log.info("Fetching student with id: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return toDTO(student);
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        log.info("Creating student with email: {}", dto.getEmail());
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("A student with this email already exists");
        }

        Student student = toEntity(dto);
        student.setStudentId(generateStudentId());
        Student saved = studentRepository.save(student);
        log.info("Student created with id: {}, studentId: {}", saved.getId(), saved.getStudentId());
        return toDTO(saved);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        log.info("Updating student with id: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());

        Student saved = studentRepository.save(student);
        log.info("Student updated with id: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional
    public void deleteStudent(Long id) {
        log.info("Deleting student with id: {}", id);
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
        log.info("Student deleted with id: {}", id);
    }

    @Transactional
    public StudentDTO enrollInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (course.getMaxCapacity() != null && course.getStudents().size() >= course.getMaxCapacity()) {
            throw new BusinessException("Course has reached maximum capacity");
        }

        if (student.getCourses().contains(course)) {
            throw new DuplicateResourceException("Student is already enrolled in this course");
        }

        student.getCourses().add(course);
        Student saved = studentRepository.save(student);
        return toDTO(saved);
    }

    @Transactional
    public StudentDTO unenrollFromCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        student.getCourses().remove(course);
        Student saved = studentRepository.save(student);
        return toDTO(saved);
    }

    public List<StudentDTO> getStudentsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        return course.getStudents().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private StudentDTO toDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .dateOfBirth(student.getDateOfBirth())
                .studentId(student.getStudentId())
                .courseIds(student.getCourses().stream()
                        .map(Course::getId)
                        .collect(Collectors.toSet()))
                .build();
    }

    private Student toEntity(StudentDTO dto) {
        return Student.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .dateOfBirth(dto.getDateOfBirth())
                .build();
    }

    private String generateStudentId() {
        return "STU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
