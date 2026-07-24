package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.*;
import com.doctorweb.backend.global.exception.BusinessException;
import com.doctorweb.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.*;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTests {
    @Mock AppointmentRepository appointmentRepository;

    @Test
    void emptyWeekdayHasCapacityWithoutDivisionErrors() {
        LocalDate friday = LocalDate.of(2026, 7, 24);
        when(appointmentRepository.findAdminRange(friday, friday)).thenReturn(List.of());

        var dashboard = service().dashboard(friday, friday);

        assertThat(dashboard.summary().totalAppointments()).isZero();
        assertThat(dashboard.summary().completedAppointments()).isZero();
        assertThat(dashboard.summary().pendingAppointments()).isZero();
        assertThat(dashboard.summary().completionRate()).isZero();
        assertThat(dashboard.summary().totalCapacity()).isEqualTo(48);
        assertThat(dashboard.summary().occupancyRate()).isZero();
        assertThat(dashboard.daily()).singleElement().satisfies(day -> {
            assertThat(day.date()).isEqualTo(friday);
            assertThat(day.appointments()).isZero();
            assertThat(day.capacity()).isEqualTo(48);
        });
        assertThat(dashboard.hourly()).hasSize(8);
        assertThat(dashboard.highlights().busiestDate()).isNull();
        assertThat(dashboard.highlights().busiestTime()).isNull();
    }

    @Test
    void sundayHasNoClinicCapacity() {
        LocalDate sunday = LocalDate.of(2026, 7, 26);
        when(appointmentRepository.findAdminRange(sunday, sunday)).thenReturn(List.of());

        var dashboard = service().dashboard(sunday, sunday);

        assertThat(dashboard.summary().totalCapacity()).isZero();
        assertThat(dashboard.daily().get(0).capacity()).isZero();
        assertThat(dashboard.daily().get(0).occupancyRate()).isZero();
    }

    @Test
    void saturdayHasEightHoursAndFortyEightSlots() {
        LocalDate saturday = LocalDate.of(2026, 7, 25);
        when(appointmentRepository.findAdminRange(saturday, saturday)).thenReturn(List.of());

        var dashboard = service().dashboard(saturday, saturday);

        assertThat(dashboard.summary().totalCapacity()).isEqualTo(48);
    }

    @Test
    void dashboardCalculatesAllSummaryGroupsAndRates() {
        LocalDate friday = LocalDate.of(2026, 7, 24);
        LocalDate saturday = friday.plusDays(1);
        Patient newPatient = patient(1L, friday.atTime(9, 0));
        Patient returningPatient = patient(2L, friday.minusMonths(1).atTime(9, 0));
        Patient legacyPatient = patient(3L, friday.minusMonths(2).atTime(9, 0));

        List<Appointment> appointments = List.of(
                appointment(1L, newPatient, friday, 8, AppointmentStatus.COMPLETED, true),
                appointment(2L, newPatient, friday, 9, AppointmentStatus.PENDING, true),
                appointment(3L, returningPatient, saturday, 8, AppointmentStatus.COMPLETED, false),
                appointment(4L, legacyPatient, saturday, 8, AppointmentStatus.PENDING, false)
        );
        when(appointmentRepository.findAdminRange(friday, saturday)).thenReturn(appointments);

        var dashboard = service().dashboard(friday, saturday);

        assertThat(dashboard.summary().totalAppointments()).isEqualTo(4);
        assertThat(dashboard.summary().completedAppointments()).isEqualTo(3);
        assertThat(dashboard.summary().pendingAppointments()).isEqualTo(1);
        assertThat(dashboard.summary().uniquePatients()).isEqualTo(3);
        assertThat(dashboard.summary().newPatients()).isEqualTo(1);
        assertThat(dashboard.summary().returningPatients()).isEqualTo(2);
        assertThat(dashboard.summary().releasedAppointments()).isEqualTo(2);
        assertThat(dashboard.summary().occupiedSlots()).isEqualTo(2);
        assertThat(dashboard.summary().totalCapacity()).isEqualTo(96);
        assertThat(dashboard.summary().completionRate()).isEqualTo(75.0);
        assertThat(dashboard.summary().occupancyRate()).isEqualTo(2.1);

        assertThat(dashboard.daily()).hasSize(2);
        assertThat(dashboard.daily().get(0).appointments()).isEqualTo(2);
        assertThat(dashboard.daily().get(0).completed()).isEqualTo(1);
        assertThat(dashboard.daily().get(0).pending()).isEqualTo(1);
        assertThat(dashboard.daily().get(1).completed()).isEqualTo(2);

        var eightOClock = dashboard.hourly().stream()
                .filter(hour -> hour.time().equals("08:00"))
                .findFirst().orElseThrow();
        assertThat(eightOClock.appointments()).isEqualTo(3);
        assertThat(eightOClock.completed()).isEqualTo(3);
        assertThat(eightOClock.released()).isEqualTo(2);
        assertThat(eightOClock.occupiedSlots()).isEqualTo(1);
        assertThat(dashboard.highlights().busiestTime()).isEqualTo("08:00");
        assertThat(dashboard.highlights().busiestTimeAppointments()).isEqualTo(3);
        assertThat(dashboard.highlights().busiestDateAppointments()).isEqualTo(2);
    }

    @Test
    void duplicateAppointmentsForOnePatientCountAsOneUniquePatient() {
        LocalDate date = LocalDate.of(2026, 7, 24);
        Patient patient = patient(1L, date.atStartOfDay());
        when(appointmentRepository.findAdminRange(date, date)).thenReturn(List.of(
                appointment(1L, patient, date, 8, AppointmentStatus.PENDING, true),
                appointment(2L, patient, date, 9, AppointmentStatus.COMPLETED, true)
        ));

        var dashboard = service().dashboard(date, date);

        assertThat(dashboard.summary().totalAppointments()).isEqualTo(2);
        assertThat(dashboard.summary().uniquePatients()).isEqualTo(1);
        assertThat(dashboard.summary().newPatients()).isEqualTo(1);
    }

    @Test
    void rangeIncludesDaysWithNoAppointments() {
        LocalDate from = LocalDate.of(2026, 7, 24);
        LocalDate to = from.plusDays(2);
        when(appointmentRepository.findAdminRange(from, to)).thenReturn(List.of());

        var dashboard = service().dashboard(from, to);

        assertThat(dashboard.daily()).extracting("date")
                .containsExactly(from, from.plusDays(1), to);
        assertThat(dashboard.summary().totalCapacity()).isEqualTo(96);
    }

    @Test
    void rejectsEndDateBeforeStartDate() {
        LocalDate from = LocalDate.of(2026, 7, 24);

        assertThatThrownBy(() -> service().dashboard(from, from.minusDays(1)))
                .isInstanceOf(BusinessException.class)
                .satisfies(error -> assertThat(((BusinessException) error).getStatus())
                        .isEqualTo(HttpStatus.BAD_REQUEST))
                .hasMessageContaining("Khoảng thống kê");
        verifyNoInteractions(appointmentRepository);
    }

    @Test
    void rejectsRangeLongerThanThreeHundredSixtySevenDays() {
        LocalDate from = LocalDate.of(2025, 1, 1);

        assertThatThrownBy(() -> service().dashboard(from, from.plusDays(367)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("367 ngày");
        verifyNoInteractions(appointmentRepository);
    }

    private StatisticsService service() {
        return new StatisticsService(appointmentRepository);
    }

    private Patient patient(Long id, LocalDateTime createdAt) {
        Patient patient = Patient.builder()
                .id(id)
                .patientCode("BN" + id)
                .fullName("Bệnh nhân " + id)
                .normalizedName("benh nhan " + id)
                .phone("0912345678")
                .build();
        ReflectionTestUtils.setField(patient, "createdAt", createdAt);
        ReflectionTestUtils.setField(patient, "updatedAt", createdAt);
        return patient;
    }

    private Appointment appointment(Long id, Patient patient, LocalDate date, int hour,
                                    AppointmentStatus status, boolean consumesCapacity) {
        AppointmentSlot slot = AppointmentSlot.builder()
                .id(id)
                .appointmentDate(date)
                .appointmentTime(LocalTime.of(hour, 0))
                .capacity(6)
                .bookedCount(consumesCapacity ? 1 : 0)
                .build();
        return Appointment.builder()
                .id(id)
                .patient(patient)
                .slot(slot)
                .status(status)
                .consumesCapacity(consumesCapacity)
                .build();
    }
}
