package com.doctorweb.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

final class ClinicSchedule {
    private static final int SLOT_MINUTES = 30;

    private ClinicSchedule() {
    }

    static List<LocalTime> operatingTimes(LocalDate date) {
        if (isWeekend(date)) {
            List<LocalTime> times = new ArrayList<>();
            times.addAll(timesBetween(LocalTime.of(8, 0), LocalTime.of(10, 30)));
            times.addAll(timesBetween(LocalTime.of(15, 0), LocalTime.of(20, 0)));
            return List.copyOf(times);
        }
        return timesBetween(LocalTime.of(17, 30), LocalTime.of(20, 0));
    }

    private static boolean isWeekend(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }

    private static List<LocalTime> timesBetween(LocalTime opens, LocalTime closes) {
        List<LocalTime> times = new ArrayList<>();
        for (LocalTime time = opens; time.isBefore(closes); time = time.plusMinutes(SLOT_MINUTES)) {
            times.add(time);
        }
        return List.copyOf(times);
    }
}
