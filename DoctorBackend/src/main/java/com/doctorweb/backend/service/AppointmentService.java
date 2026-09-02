package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.*;
import com.doctorweb.backend.dto.AppointmentDtos.*;
import com.doctorweb.backend.global.exception.*;
import com.doctorweb.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private static final int SLOT_CAPACITY = 6;
    private static final ZoneId CLINIC_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final PatientRepository patientRepository;
    private final AppointmentSlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final VisitNoteRepository visitNoteRepository;

    @Transactional(readOnly = true)
    public List<SlotAvailability> availability(LocalDate date) {
        validateBookingDate(date);
        LocalDateTime now = LocalDateTime.now(CLINIC_ZONE);
        return operatingTimes(date).stream()
                .filter(time -> LocalDateTime.of(date, time).isAfter(now))
                .map(time -> {
            var slot = slotRepository.findByAppointmentDateAndAppointmentTime(date, time);
            return new SlotAvailability(time.toString(), slot.isEmpty() || slot.get().getBookedCount() < slot.get().getCapacity());
        }).toList();
    }

    @Transactional
    public BookingResponse book(BookingRequest request) {
        validateBookingDate(request.appointmentDate());
        if (!operatingTimes(request.appointmentDate()).contains(request.appointmentTime())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Giờ khám không hợp lệ");
        }
        if (!LocalDateTime.of(request.appointmentDate(), request.appointmentTime())
                .isAfter(LocalDateTime.now(CLINIC_ZONE))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Không thể đặt một giờ khám đã qua");
        }

        slotRepository.createIfMissing(request.appointmentDate(), request.appointmentTime());
        AppointmentSlot slot = slotRepository.findAndLock(request.appointmentDate(), request.appointmentTime())
                .orElseThrow(() -> new IllegalStateException("Không thể tạo khung giờ"));
        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new BusinessException(HttpStatus.CONFLICT, "Khung giờ này vừa hết chỗ, vui lòng chọn giờ khác");
        }

        String phone = normalizePhone(request.phone());
        if (!phone.matches("^0[35789][0-9]{8}$")) {
            throw new BusinessException(HttpStatus.BAD_REQUEST,
                    "Số điện thoại phải là số di động Việt Nam gồm 10 chữ số");
        }
        String normalizedName = normalizeName(request.patientName());
        Patient patient = patientRepository
                .findFirstByPhoneAndNormalizedName(phone, normalizedName)
                .orElseGet(() -> createPatient(request, phone, normalizedName));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .slot(slot)
                .reasonForVisit(clean(request.reasonForVisit()))
                .status(AppointmentStatus.PENDING)
                .consumesCapacity(true)
                .build();
        slot.setBookedCount(slot.getBookedCount() + 1);
        slotRepository.save(slot);
        appointmentRepository.save(appointment);
        return new BookingResponse(appointment.getId(), patient.getPatientCode(),
                "Đặt lịch thành công. Phòng khám sẽ liên hệ xác nhận với bạn.");
    }

    @Transactional(readOnly = true)
    public List<AppointmentView> adminAppointments(LocalDate from, LocalDate to) {
        if (from == null) from = LocalDate.now(CLINIC_ZONE);
        if (to == null) to = from.plusDays(7);
        if (to.isBefore(from) || to.isAfter(from.plusMonths(3))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Khoảng ngày không hợp lệ");
        }
        return appointmentRepository.findAdminRange(from, to).stream().map(this::toView).toList();
    }

    @Transactional
    public AppointmentView updateStatus(Long id, StatusUpdate request) {
        Appointment appointment = appointmentRepository.findAdminById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn"));
        AppointmentSlot slot = slotRepository.findAndLock(
                appointment.getSlot().getAppointmentDate(), appointment.getSlot().getAppointmentTime())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ"));
        LocalDateTime now = LocalDateTime.now(CLINIC_ZONE);
        appointment.setStatus(request.status());
        appointment.setAdminNote(clean(request.adminNote()));

        switch (request.status()) {
            case ARRIVED -> { if (appointment.getArrivedAt() == null) appointment.setArrivedAt(now); }
            case IN_PROGRESS -> {
                if (appointment.getArrivedAt() == null) appointment.setArrivedAt(now);
                if (appointment.getStartedAt() == null) appointment.setStartedAt(now);
            }
            case COMPLETED -> { if (appointment.getCompletedAt() == null) appointment.setCompletedAt(now); }
            case CANCELLED -> { if (appointment.getCancelledAt() == null) appointment.setCancelledAt(now); }
            default -> { }
        }

        boolean terminal = request.status() == AppointmentStatus.COMPLETED
                || request.status() == AppointmentStatus.CANCELLED
                || request.status() == AppointmentStatus.NO_SHOW;
        if (!terminal && !appointment.isConsumesCapacity()) {
            if (slot.getBookedCount() >= slot.getCapacity()) {
                throw new BusinessException(HttpStatus.CONFLICT,
                        "Không thể chuyển về chưa khám vì khung giờ đã hết chỗ");
            }
            appointment.setConsumesCapacity(true);
            appointment.setCompletedAt(null);
            appointment.setCancelledAt(null);
            slot.setBookedCount(slot.getBookedCount() + 1);
            slotRepository.save(slot);
        }
        if (Boolean.TRUE.equals(request.releaseCapacity()) && terminal && appointment.isConsumesCapacity()) {
            appointment.setConsumesCapacity(false);
            slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
            slotRepository.save(slot);
        }
        return toView(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public Page<PatientSummary> patients(String query, Pageable pageable) {
        String q = query == null ? "" : query.trim();
        Page<Patient> result = q.isEmpty()
                ? patientRepository.findAll(pageable)
                : patientRepository.search(
                        normalizeName(q), normalizePhone(q), q.toUpperCase(Locale.ROOT), pageable);
        return result.map(this::toPatient);
    }

    @Transactional(readOnly = true)
    public PatientRecord patientDetail(Long id) {
        Patient patient = getPatient(id);
        return new PatientRecord(toPatient(patient),
                appointmentRepository.findByPatientIdWithSlot(id).stream().map(this::toView).toList(),
                visitNoteRepository.findByPatientId(id).stream().map(this::toVisitNote).toList());
    }

    @Transactional(readOnly = true)
    public VisitNoteView visitNote(Long appointmentId) {
        Appointment appointment = appointmentRepository.findAdminById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn"));
        return visitNoteRepository.findByAppointmentId(appointmentId)
                .map(this::toVisitNote)
                .orElseGet(() -> emptyVisitNote(appointment));
    }

    @Transactional
    public VisitNoteView saveVisitNote(Long appointmentId, VisitNoteRequest request, String username) {
        Appointment appointment = appointmentRepository.findAdminById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn"));
        VisitNote note = visitNoteRepository.findByAppointmentId(appointmentId)
                .orElseGet(() -> VisitNote.builder()
                        .appointment(appointment)
                        .patient(appointment.getPatient())
                        .createdBy(username == null || username.isBlank() ? "admin" : username)
                        .status(VisitNoteStatus.DRAFT)
                        .build());

        note.setSymptoms(clean(request.symptoms()));
        note.setExamination(clean(request.examination()));
        note.setAssessment(clean(request.assessment()));
        note.setTreatmentPlan(clean(request.treatmentPlan()));
        note.setFollowUpDate(request.followUpDate());
        note.setFollowUpTime(request.followUpTime());
        note.setStatus(request.status());
        note.setSearchText(normalizeName(String.join(" ",
                safe(note.getSymptoms()), safe(note.getExamination()),
                safe(note.getAssessment()), safe(note.getTreatmentPlan()))));
        if (request.status() == VisitNoteStatus.FINALIZED && note.getFinalizedAt() == null) {
            note.setFinalizedAt(LocalDateTime.now(CLINIC_ZONE));
        }
        if (Boolean.TRUE.equals(request.createFollowUpAppointment())) {
            scheduleFollowUp(note);
        }
        VisitNote saved = visitNoteRepository.save(note);

        if (Boolean.TRUE.equals(request.completeAppointment())) {
            updateStatus(appointmentId, new StatusUpdate(
                    AppointmentStatus.COMPLETED, request.releaseCapacity(), appointment.getAdminNote()));
        }
        return toVisitNote(saved);
    }

    @Transactional(readOnly = true)
    public List<FollowUpReminder> followUps(LocalDate from, LocalDate to) {
        if (from == null || to == null || to.isBefore(from) || to.isAfter(from.plusMonths(6))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Khoảng ngày tái khám không hợp lệ");
        }
        return visitNoteRepository.findFollowUps(from, to).stream()
                .map(note -> new FollowUpReminder(
                        note.getId(), toPatient(note.getPatient()), note.getAppointment().getId(),
                        note.getFollowUpDate(), note.getFollowUpTime(),
                        note.getFollowUpAppointment() == null ? null : note.getFollowUpAppointment().getId(),
                        note.getStatus()))
                .toList();
    }

    private void scheduleFollowUp(VisitNote note) {
        if (note.getFollowUpAppointment() != null) return;
        LocalDate date = note.getFollowUpDate();
        LocalTime time = note.getFollowUpTime();
        if (date == null || time == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Vui lòng chọn ngày và giờ tái khám");
        }
        validateBookingDate(date);
        if (!operatingTimes(date).contains(time)
                || !LocalDateTime.of(date, time).isAfter(LocalDateTime.now(CLINIC_ZONE))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Giờ tái khám không hợp lệ");
        }
        slotRepository.createIfMissing(date, time);
        AppointmentSlot slot = slotRepository.findAndLock(date, time)
                .orElseThrow(() -> new IllegalStateException("Không thể tạo khung giờ tái khám"));
        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new BusinessException(HttpStatus.CONFLICT, "Khung giờ tái khám vừa hết chỗ");
        }
        Appointment followUp = Appointment.builder()
                .patient(note.getPatient())
                .slot(slot)
                .reasonForVisit("Tái khám theo chỉ định")
                .status(AppointmentStatus.PENDING)
                .consumesCapacity(true)
                .build();
        slot.setBookedCount(slot.getBookedCount() + 1);
        slotRepository.save(slot);
        note.setFollowUpAppointment(appointmentRepository.save(followUp));
    }

    @Transactional
    public PatientSummary updatePatient(Long id, PatientUpdate request) {
        Patient patient = getPatient(id);
        patient.setFullName(request.fullName().trim());
        patient.setNormalizedName(normalizeName(request.fullName()));
        patient.setDateOfBirth(request.dateOfBirth());
        patient.setGender(clean(request.gender()));
        patient.setGuardianName(clean(request.guardianName()));
        String phone = normalizePhone(request.phone());
        if (!phone.matches("^0[35789][0-9]{8}$")) {
            throw new BusinessException(HttpStatus.BAD_REQUEST,
                    "Số điện thoại phải là số di động Việt Nam gồm 10 chữ số");
        }
        patient.setPhone(phone);
        patient.setAddress(clean(request.address()));
        patient.setNotes(clean(request.notes()));
        return toPatient(patientRepository.save(patient));
    }

    private Patient createPatient(BookingRequest request, String phone, String normalizedName) {
        Patient patient = Patient.builder()
                .fullName(request.patientName().trim())
                .normalizedName(normalizedName)
                .phone(phone)
                .build();
        patient = patientRepository.save(patient);
        patient.setPatientCode("BN" + String.format("%08d", patient.getId()));
        return patientRepository.save(patient);
    }

    private List<LocalTime> operatingTimes(LocalDate date) {
        return ClinicSchedule.operatingTimes(date);
    }

    private void validateBookingDate(LocalDate date) {
        LocalDate today = LocalDate.now(CLINIC_ZONE);
        if (date == null || date.isBefore(today) || date.isAfter(today.plusDays(90))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Chỉ có thể đặt lịch trong 90 ngày tới");
        }
    }

    private Patient getPatient(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bệnh nhân"));
    }

    private PatientSummary toPatient(Patient p) {
        return new PatientSummary(p.getId(), p.getPatientCode(), p.getFullName(), p.getDateOfBirth(),
                p.getGender(), p.getGuardianName(), p.getPhone(), p.getAddress(), p.getNotes());
    }

    private AppointmentView toView(Appointment a) {
        return new AppointmentView(a.getId(), toPatient(a.getPatient()),
                a.getSlot().getAppointmentDate(), a.getSlot().getAppointmentTime(),
                a.getReasonForVisit(), a.getStatus(), a.isConsumesCapacity(),
                a.getArrivedAt(), a.getStartedAt(), a.getCompletedAt(),
                a.getCancelledAt(), a.getAdminNote());
    }

    private VisitNoteView toVisitNote(VisitNote note) {
        return new VisitNoteView(note.getId(), note.getAppointment().getId(), note.getPatient().getId(),
                note.getSymptoms(), note.getExamination(), note.getAssessment(), note.getTreatmentPlan(),
                note.getFollowUpDate(), note.getFollowUpTime(),
                note.getFollowUpAppointment() == null ? null : note.getFollowUpAppointment().getId(),
                note.getStatus(), note.getCreatedBy(),
                note.getCreatedAt(), note.getUpdatedAt(), note.getFinalizedAt());
    }

    private VisitNoteView emptyVisitNote(Appointment appointment) {
        return new VisitNoteView(null, appointment.getId(), appointment.getPatient().getId(),
                appointment.getReasonForVisit(), null, null, null, null, null, null,
                VisitNoteStatus.DRAFT, null, null, null, null);
    }

    private String normalizeName(String value) {
        if (value == null) return "";
        return Normalizer.normalize(value.trim().toLowerCase(Locale.forLanguageTag("vi")), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replace('đ', 'd').replaceAll("\\s+", " ");
    }

    private String normalizePhone(String value) {
        if (value == null) return "";
        String phone = value.replaceAll("[^0-9+]", "");
        if (phone.startsWith("+84")) return "0" + phone.substring(3);
        if (phone.startsWith("84") && phone.length() == 11) return "0" + phone.substring(2);
        return phone;
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
