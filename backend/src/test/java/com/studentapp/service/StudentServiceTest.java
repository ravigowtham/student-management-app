package com.studentapp.service;

import com.studentapp.dto.StudentDTO;
import com.studentapp.entity.Course;
import com.studentapp.entity.Student;
import com.studentapp.exception.BusinessException;
import com.studentapp.exception.DuplicateResourceException;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.repository.CourseRepository;
import com.studentapp.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student;
    private StudentDTO studentDTO;
    private Course course;

    @BeforeEach
    void setUp() {
        student = Student.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .phone("1234567890")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .studentId("STU-ABCD1234")
                .courses(new HashSet<>())
                .build();

        studentDTO = StudentDTO.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .phone("1234567890")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .build();

        course = Course.builder()
                .id(1L)
                .courseCode("CS101")
                .courseName("Intro to CS")
                .credits(3)
                .maxCapacity(30)
                .students(new HashSet<>())
                .build();
    }

    @Test
    void getAllStudents_returnsListOfStudents() {
        when(studentRepository.findAll()).thenReturn(List.of(student));

        List<StudentDTO> result = studentService.getAllStudents();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
        verify(studentRepository).findAll();
    }

    @Test
    void getAllStudents_returnsEmptyListWhenNoStudents() {
        when(studentRepository.findAll()).thenReturn(Collections.emptyList());

        List<StudentDTO> result = studentService.getAllStudents();

        assertThat(result).isEmpty();
    }

    @Test
    void getStudentById_returnsStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        StudentDTO result = studentService.getStudentById(1L);

        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getEmail()).isEqualTo("john@test.com");
    }

    @Test
    void getStudentById_throwsWhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found");
    }

    @Test
    void createStudent_success() {
        when(studentRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.createStudent(studentDTO);

        assertThat(result.getFirstName()).isEqualTo("John");
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void createStudent_throwsOnDuplicateEmail() {
        when(studentRepository.existsByEmail("john@test.com")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(studentDTO))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("email already exists");

        verify(studentRepository, never()).save(any());
    }

    @Test
    void updateStudent_success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO updated = StudentDTO.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@test.com")
                .build();

        StudentDTO result = studentService.updateStudent(1L, updated);

        assertThat(result).isNotNull();
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void updateStudent_throwsWhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.updateStudent(99L, studentDTO))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteStudent_success() {
        when(studentRepository.existsById(1L)).thenReturn(true);

        studentService.deleteStudent(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void deleteStudent_throwsWhenNotFound() {
        when(studentRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> studentService.deleteStudent(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void enrollInCourse_success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.enrollInCourse(1L, 1L);

        assertThat(result).isNotNull();
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void enrollInCourse_throwsWhenAlreadyEnrolled() {
        student.getCourses().add(course);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        assertThatThrownBy(() -> studentService.enrollInCourse(1L, 1L))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already enrolled");
    }

    @Test
    void enrollInCourse_throwsWhenCapacityFull() {
        course.setMaxCapacity(0);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        assertThatThrownBy(() -> studentService.enrollInCourse(1L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("maximum capacity");
    }

    @Test
    void enrollInCourse_throwsWhenStudentNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.enrollInCourse(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void enrollInCourse_throwsWhenCourseNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.enrollInCourse(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void unenrollFromCourse_success() {
        student.getCourses().add(course);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.unenrollFromCourse(1L, 1L);

        assertThat(result).isNotNull();
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void getStudentsByCourse_returnsList() {
        course.getStudents().add(student);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        List<StudentDTO> result = studentService.getStudentsByCourse(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    void getStudentsByCourse_throwsWhenCourseNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentsByCourse(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
