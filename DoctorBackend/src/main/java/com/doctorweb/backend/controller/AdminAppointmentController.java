package com.doctorweb.backend.controller;

import com.doctorweb.backend.dto.AppointmentDtos.*;
import com.doctorweb.backend.dto.PageResponse;
import com.doctorweb.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/appointments")
    public List<AppointmentView> appointments(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        return appointmentService.adminAppointments(from, to);
    }

    @PatchMapping("/appointments/{id}/status")
    public AppointmentView updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdate request) {
        return appointmentService.updateStatus(id, request);
    }

    @GetMapping("/patients")
    public PageResponse<PatientSummary> patients(
            @RequestParam(defaultValue = "") String query,
            Pageable pageable) {
        return PageResponse.from(appointmentService.patients(query, pageable));
    }

    @GetMapping("/patients/{id}")
    public PatientRecord patient(@PathVariable Long id) {
        return appointmentService.patientDetail(id);
    }

    @PutMapping("/patients/{id}")
    public PatientSummary updatePatient(@PathVariable Long id, @Valid @RequestBody PatientUpdate request) {
        return appointmentService.updatePatient(id, request);
    }

    @GetMapping("/appointments/{id}/visit-note")
    public VisitNoteView visitNote(@PathVariable Long id) {
        return appointmentService.visitNote(id);
    }

    @PutMapping("/appointments/{id}/visit-note")
    public VisitNoteView saveVisitNote(@PathVariable Long id,
                                       @Valid @RequestBody VisitNoteRequest request,
                                       Authentication authentication) {
        return appointmentService.saveVisitNote(id, request,
                authentication == null ? "admin" : authentication.getName());
    }

    @GetMapping("/follow-ups")
    public List<FollowUpReminder> followUps(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return appointmentService.followUps(from, to);
    }
}
