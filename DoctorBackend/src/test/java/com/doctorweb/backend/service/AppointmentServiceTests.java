package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.*;
import com.doctorweb.backend.dto.AppointmentDtos.*;
import com.doctorweb.backend.global.exception.BusinessException;
import com.doctorweb.backend.global.exception.ResourceNotFoundException;
import com.doctorweb.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;

import java.time.*;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTests {
    private static final ZoneId CLINIC_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Mock PatientRepository patientRepository;
    @Mock AppointmentSlotRepository slotRepository;
    @Mock AppointmentRepository appointmentRepository;

    @InjectMocks AppointmentService service;

    private LocalDate bookingDate;
    private LocalTime bookingTime;

    @BeforeEach
    void setUp() {
        bookingDate = nextWeekday(LocalDate.now(CLINIC_ZONE).plusDays(1));
        bookingTime = LocalTime.of(8, 0);
    }

    @Test
    void availabilityRejectsPastDate() {
        assertThatThrownBy(() -> service.availability(LocalDate.now(CLINIC_ZONE).minusDays(1)))
                .isInstanceOf(BusinessException.class)
                .satisfies(error -> assertThat(((BusinessException) error).getStatus())
                        .isEqualTo(HttpStatus.BAD_REQUEST));
        verifyNoInteractions(slotRepository);
    }

    @Test
    void availabilityRejectsDateMoreThanNinetyDaysAway() {
        assertThatThrownBy(() -> service.availability(LocalDate.now(CLINIC_ZONE).plusDays(91)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("90 ngày");
    }

    @Test
    void sundayHasNoAvailableTimes() {
        LocalDate sunday = nextDayOfWeek(LocalDate.now(CLINIC_ZONE), DayOfWeek.SUNDAY);
        assertThat(service.availability(sunday)).isEmpty();
        verifyNoInteractions(slotRepository);
    }

    @Test
    void availabilityHidesCountsAndOnlyReportsBooleanState() {
        AppointmentSlot full = slot(bookingDate, bookingTime, 6, 6);
        when(slotRepository.findByAppointmentDateAndAppointmentTime(bookingDate, bookingTime))
                .thenReturn(Optional.of(full));

        var slots = service.availability(bookingDate);

        assertThat(slots).isNotEmpty();
        assertThat(slots.stream().filter(s -> s.time().equals("08:00")).findFirst())
                .get().extracting(SlotAvailability::available).isEqualTo(false);
    }

    @Test
    void missingSlotIsAvailable() {
        when(slotRepository.findByAppointmentDateAndAppointmentTime(any(), any()))
                .thenReturn(Optional.empty());

        assertThat(service.availability(bookingDate))
                .allMatch(SlotAvailability::available);
    }

    @Test
    void workingDayOffersExactlyEightTimesFromEightToFifteen() {
        when(slotRepository.findByAppointmentDateAndAppointmentTime(any(), any()))
                .thenReturn(Optional.empty());

        assertThat(service.availability(bookingDate))
                .extracting(SlotAvailability::time)
                .containsExactly(
                        "08:00", "09:00", "10:00", "11:00",
                        "12:00", "13:00", "14:00", "15:00"
                );
    }

    @Test
    void bookingRejectsTimeOutsideOperatingHours() {
        BookingRequest request = request("Nguyễn Văn A", "0912345678", bookingDate, LocalTime.of(7, 0));

        assertThatThrownBy(() -> service.book(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Giờ khám không hợp lệ");
        verify(slotRepository, never()).createIfMissing(any(), any());
    }

    @Test
    void bookingRejectsSixteenOClock() {
        BookingRequest request = request("Nguyễn Văn A", "0912345678", bookingDate, LocalTime.of(16, 0));

        assertThatThrownBy(() -> service.book(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Giờ khám không hợp lệ");
        verify(slotRepository, never()).createIfMissing(any(), any());
    }

    @Test
    void bookingRejectsPastDate() {
        BookingRequest request = request("Nguyễn Văn A", "0912345678",
                LocalDate.now(CLINIC_ZONE).minusDays(1), bookingTime);

        assertThatThrownBy(() -> service.book(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("90 ngày");
    }

    @Test
    void bookingRejectsInvalidVietnameseMobileNumber() {
        BookingRequest request = request("Nguyễn Văn A", "0212345678", bookingDate, bookingTime);
        mockLockedSlot(0);

        assertThatThrownBy(() -> service.book(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("số di động Việt Nam");
        verifyNoInteractions(patientRepository);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void bookingNormalizesPlus84PhoneAndCreatesPatient() {
        BookingRequest request = request(" Nguyễn Văn A ", "+84 912 345 678", bookingDate, bookingTime);
        AppointmentSlot slot = mockLockedSlot(0);
        when(patientRepository.findFirstByPhoneAndNormalizedName("0912345678", "nguyen van a"))
                .thenReturn(Optional.empty());
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient patient = invocation.getArgument(0);
            if (patient.getId() == null) patient.setId(11L);
            return patient;
        });
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(21L);
            return appointment;
        });

        BookingResponse response = service.book(request);

        ArgumentCaptor<Patient> patientCaptor = ArgumentCaptor.forClass(Patient.class);
        verify(patientRepository, times(2)).save(patientCaptor.capture());
        assertThat(patientCaptor.getValue().getPhone()).isEqualTo("0912345678");
        assertThat(patientCaptor.getValue().getFullName()).isEqualTo("Nguyễn Văn A");
        assertThat(patientCaptor.getValue().getPatientCode()).isEqualTo("BN00000011");
        assertThat(slot.getBookedCount()).isEqualTo(1);
        assertThat(response.appointmentId()).isEqualTo(21L);
        assertThat(response.patientCode()).isEqualTo("BN00000011");
    }

    @Test
    void bookingReusesPatientWithSameNormalizedNameAndPhone() {
        Patient existing = patient(5L, "BN00000005", "Nguyễn Văn A", "0912345678");
        mockLockedSlot(2);
        when(patientRepository.findFirstByPhoneAndNormalizedName("0912345678", "nguyen van a"))
                .thenReturn(Optional.of(existing));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(30L);
            return appointment;
        });

        BookingResponse response = service.book(
                request("NGUYỄN  VĂN A", "0912 345 678", bookingDate, bookingTime));

        verify(patientRepository, never()).save(any());
        ArgumentCaptor<Appointment> captor = ArgumentCaptor.forClass(Appointment.class);
        verify(appointmentRepository).save(captor.capture());
        assertThat(captor.getValue().getPatient().getId()).isEqualTo(5L);
        assertThat(response.patientCode()).isEqualTo("BN00000005");
    }

    @Test
    void samePhoneWithDifferentNameCreatesSeparatePatient() {
        mockLockedSlot(0);
        when(patientRepository.findFirstByPhoneAndNormalizedName("0912345678", "tran van b"))
                .thenReturn(Optional.empty());
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> {
            Patient patient = invocation.getArgument(0);
            if (patient.getId() == null) patient.setId(6L);
            return patient;
        });
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(31L);
            return appointment;
        });

        service.book(request("Trần Văn B", "0912345678", bookingDate, bookingTime));

        verify(patientRepository, times(2)).save(any(Patient.class));
    }

    @Test
    void sixthBookingIsAllowedAndFillsSlot() {
        AppointmentSlot slot = mockLockedSlot(5);
        Patient existing = patient(1L, "BN00000001", "Nguyễn Văn A", "0912345678");
        when(patientRepository.findFirstByPhoneAndNormalizedName(anyString(), anyString()))
                .thenReturn(Optional.of(existing));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.book(request("Nguyễn Văn A", "0912345678", bookingDate, bookingTime));

        assertThat(slot.getBookedCount()).isEqualTo(6);
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void seventhBookingIsRejected() {
        mockLockedSlot(6);

        assertThatThrownBy(() -> service.book(
                request("Nguyễn Văn A", "0912345678", bookingDate, bookingTime)))
                .isInstanceOf(BusinessException.class)
                .satisfies(error -> assertThat(((BusinessException) error).getStatus())
                        .isEqualTo(HttpStatus.CONFLICT))
                .hasMessageContaining("hết chỗ");
        verifyNoInteractions(patientRepository);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void completingWithoutReleaseKeepsCapacity() {
        Appointment appointment = appointment(AppointmentStatus.PENDING, true, 3);
        mockStatusUpdate(appointment);

        AppointmentView result = service.updateStatus(appointment.getId(),
                new StatusUpdate(AppointmentStatus.COMPLETED, false, "Đã khám"));

        assertThat(result.status()).isEqualTo(AppointmentStatus.COMPLETED);
        assertThat(result.consumesCapacity()).isTrue();
        assertThat(result.completedAt()).isNotNull();
        assertThat(appointment.getSlot().getBookedCount()).isEqualTo(3);
    }

    @Test
    void completingAndReleasingDecrementsCapacityOnce() {
        Appointment appointment = appointment(AppointmentStatus.PENDING, true, 3);
        mockStatusUpdate(appointment);

        AppointmentView result = service.updateStatus(appointment.getId(),
                new StatusUpdate(AppointmentStatus.COMPLETED, true, null));

        assertThat(result.consumesCapacity()).isFalse();
        assertThat(appointment.getSlot().getBookedCount()).isEqualTo(2);
        verify(slotRepository).save(appointment.getSlot());
    }

    @Test
    void releasingAlreadyReleasedAppointmentIsIdempotent() {
        Appointment appointment = appointment(AppointmentStatus.COMPLETED, false, 2);
        mockStatusUpdate(appointment);

        service.updateStatus(appointment.getId(),
                new StatusUpdate(AppointmentStatus.COMPLETED, true, null));

        assertThat(appointment.getSlot().getBookedCount()).isEqualTo(2);
        verify(slotRepository, never()).save(any());
    }

    @Test
    void reopeningReleasedAppointmentReclaimsCapacity() {
        Appointment appointment = appointment(AppointmentStatus.COMPLETED, false, 2);
        appointment.setCompletedAt(LocalDateTime.now(CLINIC_ZONE).minusHours(1));
        mockStatusUpdate(appointment);

        AppointmentView result = service.updateStatus(appointment.getId(),
                new StatusUpdate(AppointmentStatus.PENDING, false, null));

        assertThat(result.status()).isEqualTo(AppointmentStatus.PENDING);
        assertThat(result.consumesCapacity()).isTrue();
        assertThat(result.completedAt()).isNull();
        assertThat(appointment.getSlot().getBookedCount()).isEqualTo(3);
    }

    @Test
    void reopeningReleasedAppointmentFailsWhenSlotIsFull() {
        Appointment appointment = appointment(AppointmentStatus.COMPLETED, false, 6);
        mockStatusUpdate(appointment);

        assertThatThrownBy(() -> service.updateStatus(appointment.getId(),
                new StatusUpdate(AppointmentStatus.PENDING, false, null)))
                .isInstanceOf(BusinessException.class)
                .satisfies(error -> assertThat(((BusinessException) error).getStatus())
                        .isEqualTo(HttpStatus.CONFLICT))
                .hasMessageContaining("hết chỗ");
        assertThat(appointment.isConsumesCapacity()).isFalse();
        assertThat(appointment.getSlot().getBookedCount()).isEqualTo(6);
    }

    @Test
    void updatingUnknownAppointmentReturnsNotFound() {
        when(appointmentRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(404L,
                new StatusUpdate(AppointmentStatus.COMPLETED, false, null)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void adminRangeRejectsEndBeforeStart() {
        assertThatThrownBy(() -> service.adminAppointments(bookingDate, bookingDate.minusDays(1)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Khoảng ngày");
        verify(appointmentRepository, never()).findAdminRange(any(), any());
    }

    @Test
    void patientSearchNormalizesVietnameseName() {
        Pageable pageable = PageRequest.of(0, 20);
        when(patientRepository.findByNormalizedNameContainingOrPhoneContainingOrPatientCodeContaining(
                "nguyen van a", "", "NGUYỄN VĂN A", pageable))
                .thenReturn(Page.empty(pageable));

        service.patients("Nguyễn Văn A", pageable);

        verify(patientRepository).findByNormalizedNameContainingOrPhoneContainingOrPatientCodeContaining(
                "nguyen van a", "", "NGUYỄN VĂN A", pageable);
    }

    @Test
    void updatingPatientNormalizesPlus84Phone() {
        Patient patient = patient(1L, "BN00000001", "Tên cũ", "0911111111");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PatientSummary updated = service.updatePatient(1L,
                new PatientUpdate("Tên mới", null, null, null,
                        "+84 912 345 678", null, null));

        assertThat(updated.fullName()).isEqualTo("Tên mới");
        assertThat(updated.phone()).isEqualTo("0912345678");
    }

    @Test
    void updatingPatientRejectsInvalidPhone() {
        Patient patient = patient(1L, "BN00000001", "Nguyễn Văn A", "0911111111");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

        assertThatThrownBy(() -> service.updatePatient(1L,
                new PatientUpdate("Nguyễn Văn A", null, null, null,
                        "123", null, null)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("số di động Việt Nam");
        verify(patientRepository, never()).save(any());
    }

    private BookingRequest request(String name, String phone, LocalDate date, LocalTime time) {
        return new BookingRequest(name, phone, date, time, "Sốt và ho");
    }

    private AppointmentSlot mockLockedSlot(int bookedCount) {
        AppointmentSlot slot = slot(bookingDate, bookingTime, 6, bookedCount);
        when(slotRepository.findAndLock(bookingDate, bookingTime)).thenReturn(Optional.of(slot));
        return slot;
    }

    private AppointmentSlot slot(LocalDate date, LocalTime time, int capacity, int bookedCount) {
        return AppointmentSlot.builder()
                .id(10L).appointmentDate(date).appointmentTime(time)
                .capacity(capacity).bookedCount(bookedCount).build();
    }

    private Patient patient(Long id, String code, String name, String phone) {
        return Patient.builder()
                .id(id).patientCode(code).fullName(name)
                .normalizedName(name.toLowerCase(Locale.ROOT))
                .phone(phone).build();
    }

    private Appointment appointment(AppointmentStatus status, boolean consumesCapacity, int bookedCount) {
        return Appointment.builder()
                .id(100L)
                .patient(patient(1L, "BN00000001", "Nguyễn Văn A", "0912345678"))
                .slot(slot(bookingDate, bookingTime, 6, bookedCount))
                .status(status)
                .consumesCapacity(consumesCapacity)
                .reasonForVisit("Sốt")
                .build();
    }

    private void mockStatusUpdate(Appointment appointment) {
        when(appointmentRepository.findById(appointment.getId())).thenReturn(Optional.of(appointment));
        when(slotRepository.findAndLock(
                appointment.getSlot().getAppointmentDate(),
                appointment.getSlot().getAppointmentTime()))
                .thenReturn(Optional.of(appointment.getSlot()));
        lenient().when(appointmentRepository.save(any(Appointment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private LocalDate nextWeekday(LocalDate date) {
        LocalDate result = date;
        while (result.getDayOfWeek() == DayOfWeek.SATURDAY
                || result.getDayOfWeek() == DayOfWeek.SUNDAY) {
            result = result.plusDays(1);
        }
        return result;
    }

    private LocalDate nextDayOfWeek(LocalDate start, DayOfWeek dayOfWeek) {
        LocalDate result = start;
        while (result.getDayOfWeek() != dayOfWeek) result = result.plusDays(1);
        return result;
    }
}
