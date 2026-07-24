package com.doctorweb.backend.dto;

import java.time.LocalDate;
import java.util.List;

public final class StatisticsDtos {
    private StatisticsDtos() {}

    public record Summary(
            long totalAppointments,
            long completedAppointments,
            long pendingAppointments,
            long uniquePatients,
            long newPatients,
            long returningPatients,
            long releasedAppointments,
            long occupiedSlots,
            long totalCapacity,
            double completionRate,
            double occupancyRate
    ) {}

    public record DailyPoint(
            LocalDate date,
            long appointments,
            long completed,
            long pending,
            long occupiedSlots,
            long capacity,
            double occupancyRate
    ) {}

    public record HourlyPoint(
            String time,
            long appointments,
            long completed,
            long released,
            long occupiedSlots
    ) {}

    public record Highlights(
            LocalDate busiestDate,
            long busiestDateAppointments,
            String busiestTime,
            long busiestTimeAppointments
    ) {}

    public record Dashboard(
            LocalDate from,
            LocalDate to,
            Summary summary,
            List<DailyPoint> daily,
            List<HourlyPoint> hourly,
            Highlights highlights
    ) {}
}
