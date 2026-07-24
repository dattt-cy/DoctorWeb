package com.doctorweb.backend.dto;

import com.doctorweb.backend.domain.AppointmentStatus;
import com.doctorweb.backend.dto.AppointmentDtos.*;
import jakarta.validation.*;
import org.junit.jupiter.api.*;

import java.time.*;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class AppointmentRequestValidationTests {
    private static Validator validator;

    @BeforeAll
    static void createValidator() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void validBookingRequestHasNoConstraintViolations() {
        BookingRequest request = validBooking();

        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void patientNameIsRequired() {
        BookingRequest request = new BookingRequest(
                " ", "0912345678", LocalDate.now().plusDays(1), LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "patientName");
    }

    @Test
    void patientNameCannotExceedOneHundredFiftyCharacters() {
        BookingRequest request = new BookingRequest(
                "a".repeat(151), "0912345678",
                LocalDate.now().plusDays(1), LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "patientName");
    }

    @Test
    void phoneIsRequired() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", " ", LocalDate.now().plusDays(1), LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "phone");
    }

    @Test
    void phoneCannotContainLetters() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", "0912ABC678",
                LocalDate.now().plusDays(1), LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "phone");
    }

    @Test
    void appointmentDateIsRequired() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", "0912345678", null, LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "appointmentDate");
    }

    @Test
    void appointmentDateCannotBeInPast() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", "0912345678",
                LocalDate.now().minusDays(1), LocalTime.of(8, 0), null);

        assertFieldViolation(validator.validate(request), "appointmentDate");
    }

    @Test
    void appointmentTimeIsRequired() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", "0912345678", LocalDate.now().plusDays(1), null, null);

        assertFieldViolation(validator.validate(request), "appointmentTime");
    }

    @Test
    void symptomsCannotExceedFiveHundredCharacters() {
        BookingRequest request = new BookingRequest(
                "Nguyễn Văn A", "0912345678",
                LocalDate.now().plusDays(1), LocalTime.of(8, 0), "a".repeat(501));

        assertFieldViolation(validator.validate(request), "reasonForVisit");
    }

    @Test
    void statusUpdateRequiresStatus() {
        StatusUpdate request = new StatusUpdate(null, false, null);

        assertFieldViolation(validator.validate(request), "status");
    }

    @Test
    void statusUpdateAcceptsSupportedStatus() {
        StatusUpdate request = new StatusUpdate(AppointmentStatus.COMPLETED, true, "Đã khám");

        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void adminNoteCannotExceedTwoThousandCharacters() {
        StatusUpdate request = new StatusUpdate(
                AppointmentStatus.COMPLETED, false, "a".repeat(2001));

        assertFieldViolation(validator.validate(request), "adminNote");
    }

    @Test
    void patientUpdateRequiresNameAndPhone() {
        PatientUpdate request = new PatientUpdate(
                "", null, null, null, "", null, null);

        Set<ConstraintViolation<PatientUpdate>> violations = validator.validate(request);

        assertFieldViolation(violations, "fullName");
        assertFieldViolation(violations, "phone");
    }

    @Test
    void patientUpdateOptionalFieldsMayBeNull() {
        PatientUpdate request = new PatientUpdate(
                "Nguyễn Văn A", null, null, null, "0912345678", null, null);

        assertThat(validator.validate(request)).isEmpty();
    }

    private BookingRequest validBooking() {
        return new BookingRequest(
                "Nguyễn Văn A",
                "0912 345 678",
                LocalDate.now().plusDays(1),
                LocalTime.of(8, 0),
                "Sốt và ho"
        );
    }

    private <T> void assertFieldViolation(Set<ConstraintViolation<T>> violations, String field) {
        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains(field);
    }
}
