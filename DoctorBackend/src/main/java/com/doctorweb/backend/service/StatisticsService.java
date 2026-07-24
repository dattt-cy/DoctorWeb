package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.Appointment;
import com.doctorweb.backend.domain.AppointmentStatus;
import com.doctorweb.backend.dto.StatisticsDtos.*;
import com.doctorweb.backend.global.exception.BusinessException;
import com.doctorweb.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private static final ZoneId CLINIC_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final int SLOT_CAPACITY = 6;

    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public Dashboard dashboard(LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now(CLINIC_ZONE);
        if (from == null) from = today.minusDays(29);
        if (to == null) to = today;
        if (to.isBefore(from) || ChronoUnit.DAYS.between(from, to) > 366) {
            throw new BusinessException(HttpStatus.BAD_REQUEST,
                    "Khoảng thống kê phải từ 1 đến 367 ngày");
        }
        final LocalDate rangeFrom = from;
        final LocalDate rangeTo = to;

        List<Appointment> appointments = appointmentRepository.findAdminRange(rangeFrom, rangeTo);
        long completed = appointments.stream().filter(this::isCompleted).count();
        long pending = appointments.size() - completed;
        long released = appointments.stream().filter(a -> !a.isConsumesCapacity()).count();
        long occupied = appointments.stream().filter(Appointment::isConsumesCapacity).count();

        Map<Long, Appointment> uniquePatientAppointments = appointments.stream()
                .collect(Collectors.toMap(
                        a -> a.getPatient().getId(),
                        Function.identity(),
                        (first, ignored) -> first
                ));
        long newPatients = uniquePatientAppointments.values().stream()
                .filter(a -> a.getPatient().getCreatedAt() != null)
                .filter(a -> {
                    LocalDate createdDate = a.getPatient().getCreatedAt().toLocalDate();
                    return !createdDate.isBefore(rangeFrom) && !createdDate.isAfter(rangeTo);
                })
                .count();
        long uniquePatients = uniquePatientAppointments.size();
        long returningPatients = Math.max(0, uniquePatients - newPatients);
        long totalCapacity = rangeFrom.datesUntil(rangeTo.plusDays(1))
                .mapToLong(this::dailyCapacity)
                .sum();

        Summary summary = new Summary(
                appointments.size(), completed, pending, uniquePatients, newPatients,
                returningPatients, released, occupied, totalCapacity,
                percent(completed, appointments.size()),
                percent(occupied, totalCapacity)
        );

        Map<LocalDate, List<Appointment>> byDate = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getSlot().getAppointmentDate()));
        List<DailyPoint> daily = rangeFrom.datesUntil(rangeTo.plusDays(1))
                .map(date -> dailyPoint(date, byDate.getOrDefault(date, List.of())))
                .toList();

        Map<LocalTime, List<Appointment>> byTime = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getSlot().getAppointmentTime()));
        SortedSet<LocalTime> times = new TreeSet<>();
        for (int hour = 8; hour <= 16; hour++) times.add(LocalTime.of(hour, 0));
        times.addAll(byTime.keySet());
        List<HourlyPoint> hourly = times.stream()
                .map(time -> hourlyPoint(time, byTime.getOrDefault(time, List.of())))
                .toList();

        DailyPoint busiestDay = daily.stream()
                .max(Comparator.comparingLong(DailyPoint::appointments))
                .orElse(null);
        HourlyPoint busiestTime = hourly.stream()
                .max(Comparator.comparingLong(HourlyPoint::appointments))
                .orElse(null);
        Highlights highlights = new Highlights(
                busiestDay == null || busiestDay.appointments() == 0 ? null : busiestDay.date(),
                busiestDay == null ? 0 : busiestDay.appointments(),
                busiestTime == null || busiestTime.appointments() == 0 ? null : busiestTime.time(),
                busiestTime == null ? 0 : busiestTime.appointments()
        );

        return new Dashboard(rangeFrom, rangeTo, summary, daily, hourly, highlights);
    }

    private DailyPoint dailyPoint(LocalDate date, List<Appointment> appointments) {
        long completed = appointments.stream().filter(this::isCompleted).count();
        long occupied = appointments.stream().filter(Appointment::isConsumesCapacity).count();
        long capacity = dailyCapacity(date);
        return new DailyPoint(date, appointments.size(), completed,
                appointments.size() - completed, occupied, capacity, percent(occupied, capacity));
    }

    private HourlyPoint hourlyPoint(LocalTime time, List<Appointment> appointments) {
        return new HourlyPoint(
                time.toString(),
                appointments.size(),
                appointments.stream().filter(this::isCompleted).count(),
                appointments.stream().filter(a -> !a.isConsumesCapacity()).count(),
                appointments.stream().filter(Appointment::isConsumesCapacity).count()
        );
    }

    private boolean isCompleted(Appointment appointment) {
        // Dữ liệu cũ có thể đã giải phóng suất trước khi trạng thái được đồng bộ.
        return appointment.getStatus() == AppointmentStatus.COMPLETED
                || !appointment.isConsumesCapacity();
    }

    private long dailyCapacity(LocalDate date) {
        if (date.getDayOfWeek() == DayOfWeek.SUNDAY) return 0;
        int slots = date.getDayOfWeek() == DayOfWeek.SATURDAY ? 4 : 9;
        return (long) slots * SLOT_CAPACITY;
    }

    private double percent(long value, long total) {
        if (total <= 0) return 0;
        return Math.round(value * 1000.0 / total) / 10.0;
    }
}
