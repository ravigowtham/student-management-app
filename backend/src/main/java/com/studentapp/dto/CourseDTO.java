package com.studentapp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CourseDTO {

    private Long id;

    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code must be under 20 characters")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Size(max = 200, message = "Course name must be under 200 characters")
    private String courseName;

    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 12, message = "Credits must be at most 12")
    private Integer credits;

    private Integer maxCapacity;

    @Size(max = 150, message = "Instructor name must be under 150 characters")
    private String instructor;

    private Integer enrolledCount;
}
