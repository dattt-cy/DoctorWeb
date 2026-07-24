package com.doctorweb.backend.service;

import com.doctorweb.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTests {
    @Mock
    private AppointmentRepository appointmentRepository;

    @Test
    void emptyWeekdayHasCapacityWithoutDivisionErrors() {
        LocalDate friday = LocalDate.of(2026, 7, 24);
        when(appointmentRepository.findAdminRange(friday, friday)).thenReturn(List.of());

        var dashboard = new StatisticsService(appointmentRepository).dashboard(friday, friday);

        assertThat(dashboard.summary().totalAppointments()).isZero();
        assertThat(dashboard.summary().completionRate()).isZero();
        assertThat(dashboard.summary().totalCapacity()).isEqualTo(54);
        assertThat(dashboard.summary().occupancyRate()).isZero();
        assertThat(dashboard.daily()).hasSize(1);
    }

    @Test
    void sundayHasNoClinicCapacity() {
        LocalDate sunday = LocalDate.of(2026, 7, 26);
        when(appointmentRepository.findAdminRange(sunday, sunday)).thenReturn(List.of());

        var dashboard = new StatisticsService(appointmentRepository).dashboard(sunday, sunday);

        assertThat(dashboard.summary().totalCapacity()).isZero();
        assertThat(dashboard.daily().get(0).capacity()).isZero();
        assertThat(dashboard.daily().get(0).occupancyRate()).isZero();
    }
}
