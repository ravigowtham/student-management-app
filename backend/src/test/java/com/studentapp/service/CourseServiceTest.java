package com.studentapp.service;

import com.studentapp.dto.CourseDTO;
import com.studentapp.entity.Course;
import com.studentapp.entity.Student;
import com.studentapp.exception.BusinessException;
import com.studentapp.exception.DuplicateResourceException;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        course = Course.builder()
                .id(1L)
                .courseCode("CS101")
                .courseName("Intro to CS")
                .description("Basics of CS")
                .credits(3)
                .maxCapacity(30)
                .instructor("Dr. Smith")
                .students(new HashSet<>())
                .build();

        courseDTO = CourseDTO.builder()
                .courseCode("CS101")
                .courseName("Intro to CS")
                .description("Basics of CS")
                .credits(3)
                .maxCapacity(30)
                .instructor("Dr. Smith")
                .build();
    }

    @Test
    void getAllCourses_returnsList() {
        when(courseRepository.findAll()).thenReturn(List.of(course));

        List<CourseDTO> result = courseService.getAllCourses();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCourseCode()).isEqualTo("CS101");
    }

    @Test
    void getAllCourses_returnsEmptyList() {
        when(courseRepository.findAll()).thenReturn(Collections.emptyList());

        List<CourseDTO> result = courseService.getAllCourses();

        assertThat(result).isEmpty();
    }

    @Test
    void getCourseById_returnsCourse() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        CourseDTO result = courseService.getCourseById(1L);

        assertThat(result.getCourseCode()).isEqualTo("CS101");
        assertThat(result.getCourseName()).isEqualTo("Intro to CS");
    }

    @Test
    void getCourseById_throwsWhenNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.getCourseById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Course not found");
    }

    @Test
    void createCourse_success() {
        when(courseRepository.existsByCourseCode("CS101")).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.createCourse(courseDTO);

        assertThat(result.getCourseCode()).isEqualTo("CS101");
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createCourse_throwsOnDuplicateCode() {
        when(courseRepository.existsByCourseCode("CS101")).thenReturn(true);

        assertThatThrownBy(() -> courseService.createCourse(courseDTO))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("code already exists");

        verify(courseRepository, never()).save(any());
    }

    @Test
    void updateCourse_success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO updated = CourseDTO.builder()
                .courseCode("CS102")
                .courseName("Advanced CS")
                .credits(4)
                .build();

        CourseDTO result = courseService.updateCourse(1L, updated);

        assertThat(result).isNotNull();
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void updateCourse_throwsWhenNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.updateCourse(99L, courseDTO))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteCourse_success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        courseService.deleteCourse(1L);

        verify(courseRepository).deleteById(1L);
    }

    @Test
    void deleteCourse_throwsWhenNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.deleteCourse(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteCourse_throwsWhenCourseHasEnrolledStudents() {
        Student student = new Student();
        course.getStudents().add(student);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        assertThatThrownBy(() -> courseService.deleteCourse(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("enrolled student");

        verify(courseRepository, never()).deleteById(any());
    }

    @Test
    void getCourseById_returnsEnrolledCount() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        CourseDTO result = courseService.getCourseById(1L);

        assertThat(result.getEnrolledCount()).isEqualTo(0);
    }
}
