package com.doctorweb.backend.controller;

import com.doctorweb.backend.dto.AppointmentDtos.*;
import com.doctorweb.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/appointments")
@RequiredArgsConstructor
public class PublicAppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping("/availability")
    public List<SlotAvailability> availability(@RequestParam LocalDate date) {
        return appointmentService.availability(date);
    }

    @PostMapping
    public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.book(request));
    }
}
