package com.doctorweb.backend.dto;

import com.doctorweb.backend.domain.AppointmentStatus;
import com.doctorweb.backend.domain.VisitNoteStatus;
import jakarta.validation.constraints.*;
import java.time.*;
import java.util.List;

public final class AppointmentDtos {
    private AppointmentDtos() {}

    public record SlotAvailability(String time, boolean available) {}

    public record BookingRequest(
            @NotBlank @Size(max = 150) String patientName,
            @NotBlank @Pattern(regexp = "^[0-9+ .()-]{8,20}$", message = "Số điện thoại không hợp lệ") String phone,
            @NotNull @FutureOrPresent LocalDate appointmentDate,
            @NotNull LocalTime appointmentTime,
            @Size(max = 500) String reasonForVisit
    ) {}

    public record BookingResponse(Long appointmentId, String patientCode, String message) {}

    public record PatientSummary(
            Long id, String patientCode, String fullName, LocalDate dateOfBirth,
            String gender, String guardianName, String phone, String address, String notes
    ) {}

    public record AppointmentView(
            Long id, PatientSummary patient, LocalDate appointmentDate, LocalTime appointmentTime,
            String reasonForVisit, AppointmentStatus status, boolean consumesCapacity,
            LocalDateTime arrivedAt, LocalDateTime startedAt, LocalDateTime completedAt,
            LocalDateTime cancelledAt, String adminNote
    ) {}

    public record StatusUpdate(
            @NotNull AppointmentStatus status,
            Boolean releaseCapacity,
            @Size(max = 2000) String adminNote
    ) {}

    public record PatientUpdate(
            @NotBlank @Size(max = 150) String fullName,
            @PastOrPresent LocalDate dateOfBirth,
            @Size(max = 20) String gender,
            @Size(max = 150) String guardianName,
            @NotBlank @Pattern(regexp = "^[0-9+ .()-]{8,20}$") String phone,
            @Size(max = 255) String address,
            @Size(max = 2000) String notes
    ) {}

    public record PatientDetail(PatientSummary patient, List<AppointmentView> appointments) {}

    public record VisitNoteRequest(
            @Size(max = 5000) String symptoms,
            @Size(max = 5000) String examination,
            @Size(max = 5000) String assessment,
            @Size(max = 5000) String treatmentPlan,
            LocalDate followUpDate,
            LocalTime followUpTime,
            @NotNull VisitNoteStatus status,
            Boolean completeAppointment,
            Boolean releaseCapacity,
            Boolean createFollowUpAppointment
    ) {}

    public record VisitNoteView(
            Long id, Long appointmentId, Long patientId,
            String symptoms, String examination, String assessment, String treatmentPlan,
            LocalDate followUpDate, LocalTime followUpTime, Long followUpAppointmentId,
            VisitNoteStatus status, String createdBy,
            LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime finalizedAt
    ) {}

    public record PatientRecord(
            PatientSummary patient, List<AppointmentView> appointments, List<VisitNoteView> visitNotes
    ) {}

    public record FollowUpReminder(
            Long noteId, PatientSummary patient, Long sourceAppointmentId,
            LocalDate followUpDate, LocalTime followUpTime, Long followUpAppointmentId,
            VisitNoteStatus noteStatus
    ) {}
}
