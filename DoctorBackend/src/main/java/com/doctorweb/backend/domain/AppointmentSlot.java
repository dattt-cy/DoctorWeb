package com.doctorweb.backend.domain;

import com.doctorweb.backend.global.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointment_slot", uniqueConstraints = @UniqueConstraint(columnNames = {"appointment_date", "appointment_time"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentSlot extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;
    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;
    @Builder.Default
    private Integer capacity = 6;
    @Column(name = "booked_count", nullable = false)
    @Builder.Default
    private Integer bookedCount = 0;
}
