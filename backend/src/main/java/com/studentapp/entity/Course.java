package com.studentapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "COURSES")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "COURSE_CODE", nullable = false, unique = true, length = 20)
    private String courseCode;

    @Column(name = "COURSE_NAME", nullable = false, length = 200)
    private String courseName;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "CREDITS", nullable = false)
    private Integer credits;

    @Column(name = "MAX_CAPACITY")
    private Integer maxCapacity;

    @Column(name = "INSTRUCTOR", length = 150)
    private String instructor;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Student> students = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
