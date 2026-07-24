package com.doctorweb.backend.controller;

import com.doctorweb.backend.dto.AppointmentDtos.*;
import com.doctorweb.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
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
    public Page<PatientSummary> patients(@RequestParam(defaultValue = "") String query, Pageable pageable) {
        return appointmentService.patients(query, pageable);
    }

    @GetMapping("/patients/{id}")
    public PatientDetail patient(@PathVariable Long id) {
        return appointmentService.patientDetail(id);
    }

    @PutMapping("/patients/{id}")
    public PatientSummary updatePatient(@PathVariable Long id, @Valid @RequestBody PatientUpdate request) {
        return appointmentService.updatePatient(id, request);
    }
}
