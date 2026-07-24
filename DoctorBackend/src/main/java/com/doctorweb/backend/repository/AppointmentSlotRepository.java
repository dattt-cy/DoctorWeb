package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.AppointmentSlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.*;
import java.util.*;

public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    Optional<AppointmentSlot> findByAppointmentDateAndAppointmentTime(LocalDate date, LocalTime time);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AppointmentSlot s where s.appointmentDate = :date and s.appointmentTime = :time")
    Optional<AppointmentSlot> findAndLock(@Param("date") LocalDate date, @Param("time") LocalTime time);

    @Modifying
    @Query(value = "INSERT IGNORE INTO appointment_slot (appointment_date, appointment_time, capacity, booked_count, created_at, updated_at) VALUES (:date, :time, 6, 0, NOW(6), NOW(6))", nativeQuery = true)
    void createIfMissing(@Param("date") LocalDate date, @Param("time") LocalTime time);
}
