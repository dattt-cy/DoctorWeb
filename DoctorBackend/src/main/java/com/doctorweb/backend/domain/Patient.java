package com.doctorweb.backend.domain;

import com.doctorweb.backend.global.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "patient_code", unique = true, length = 24)
    private String patientCode;
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;
    @Column(name = "normalized_name", nullable = false, length = 150)
    private String normalizedName;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @Column(length = 20)
    private String gender;
    @Column(name = "guardian_name", length = 150)
    private String guardianName;
    @Column(nullable = false, length = 20)
    private String phone;
    private String address;
    @Column(columnDefinition = "TEXT")
    private String notes;
}
