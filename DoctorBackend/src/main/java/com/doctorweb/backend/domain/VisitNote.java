package com.doctorweb.backend.domain;

import com.doctorweb.backend.global.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visit_note", uniqueConstraints = @UniqueConstraint(columnNames = "appointment_id"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VisitNote extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(columnDefinition = "TEXT")
    private String symptoms;
    @Column(columnDefinition = "TEXT")
    private String examination;
    @Column(columnDefinition = "TEXT")
    private String assessment;
    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;
    @Column(name = "follow_up_date")
    private LocalDate followUpDate;
    @Column(name = "follow_up_time")
    private java.time.LocalTime followUpTime;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follow_up_appointment_id")
    private Appointment followUpAppointment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VisitNoteStatus status;

    @Column(name = "search_text", columnDefinition = "TEXT")
    private String searchText;
    @Column(name = "created_by", nullable = false, length = 100)
    private String createdBy;
    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;
}
