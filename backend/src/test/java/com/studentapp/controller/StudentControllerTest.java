package com.studentapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentapp.dto.EnrollmentDTO;
import com.studentapp.dto.StudentDTO;
import com.studentapp.exception.ResourceNotFoundException;
import com.studentapp.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        studentDTO = StudentDTO.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .studentId("STU-ABCD1234")
                .courseIds(Set.of())
                .build();
    }

    @Test
    void getAllStudents_returns200() throws Exception {
        when(studentService.getAllStudents()).thenReturn(List.of(studentDTO));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    void getStudentById_returns200() throws Exception {
        when(studentService.getStudentById(1L)).thenReturn(studentDTO);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.email").value("john@test.com"));
    }

    @Test
    void getStudentById_returns404WhenNotFound() throws Exception {
        when(studentService.getStudentById(99L))
                .thenThrow(new ResourceNotFoundException("Student not found with id: 99"));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Student not found with id: 99"));
    }

    @Test
    void createStudent_returns201() throws Exception {
        StudentDTO input = StudentDTO.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@test.com")
                .build();

        when(studentService.createStudent(any(StudentDTO.class))).thenReturn(studentDTO);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentId").value("STU-ABCD1234"));
    }

    @Test
    void createStudent_returns400WhenValidationFails() throws Exception {
        StudentDTO invalid = StudentDTO.builder()
                .firstName("")
                .lastName("")
                .email("not-an-email")
                .build();

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());
    }

    @Test
    void updateStudent_returns200() throws Exception {
        StudentDTO input = StudentDTO.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@test.com")
                .build();

        when(studentService.updateStudent(eq(1L), any(StudentDTO.class))).thenReturn(studentDTO);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteStudent_returns204() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());

        verify(studentService).deleteStudent(1L);
    }

    @Test
    void enrollInCourse_returns200() throws Exception {
        EnrollmentDTO enrollmentDTO = EnrollmentDTO.builder()
                .studentId(1L)
                .courseId(1L)
                .build();

        when(studentService.enrollInCourse(1L, 1L)).thenReturn(studentDTO);

        mockMvc.perform(post("/api/students/enroll")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(enrollmentDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void unenrollFromCourse_returns200() throws Exception {
        EnrollmentDTO enrollmentDTO = EnrollmentDTO.builder()
                .studentId(1L)
                .courseId(1L)
                .build();

        when(studentService.unenrollFromCourse(1L, 1L)).thenReturn(studentDTO);

        mockMvc.perform(post("/api/students/unenroll")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(enrollmentDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void getStudentsByCourse_returns200() throws Exception {
        when(studentService.getStudentsByCourse(1L)).thenReturn(List.of(studentDTO));

        mockMvc.perform(get("/api/students/by-course/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}
