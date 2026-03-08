package com.studentapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentapp.dto.CourseDTO;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;

    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        courseDTO = CourseDTO.builder()
                .id(1L)
                .courseCode("CS101")
                .courseName("Intro to CS")
                .description("Basics of CS")
                .credits(3)
                .maxCapacity(30)
                .instructor("Dr. Smith")
                .enrolledCount(0)
                .build();
    }

    @Test
    void getAllCourses_returns200() throws Exception {
        when(courseService.getAllCourses()).thenReturn(List.of(courseDTO));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].courseCode").value("CS101"));
    }

    @Test
    void getCourseById_returns200() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(courseDTO);

        mockMvc.perform(get("/api/courses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseName").value("Intro to CS"));
    }

    @Test
    void getCourseById_returns404WhenNotFound() throws Exception {
        when(courseService.getCourseById(99L))
                .thenThrow(new ResourceNotFoundException("Course not found with id: 99"));

        mockMvc.perform(get("/api/courses/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Course not found with id: 99"));
    }

    @Test
    void createCourse_returns201() throws Exception {
        CourseDTO input = CourseDTO.builder()
                .courseCode("CS101")
                .courseName("Intro to CS")
                .credits(3)
                .build();

        when(courseService.createCourse(any(CourseDTO.class))).thenReturn(courseDTO);

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseCode").value("CS101"));
    }

    @Test
    void createCourse_returns400WhenValidationFails() throws Exception {
        CourseDTO invalid = CourseDTO.builder()
                .courseCode("")
                .courseName("")
                .credits(null)
                .build();

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void updateCourse_returns200() throws Exception {
        CourseDTO input = CourseDTO.builder()
                .courseCode("CS102")
                .courseName("Advanced CS")
                .credits(4)
                .build();

        when(courseService.updateCourse(eq(1L), any(CourseDTO.class))).thenReturn(courseDTO);

        mockMvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCourse_returns204() throws Exception {
        doNothing().when(courseService).deleteCourse(1L);

        mockMvc.perform(delete("/api/courses/1"))
                .andExpect(status().isNoContent());

        verify(courseService).deleteCourse(1L);
    }
}
