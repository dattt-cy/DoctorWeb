package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.Appointment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("select a from Appointment a join fetch a.patient join fetch a.slot s where s.appointmentDate between :from and :to order by s.appointmentDate, s.appointmentTime")
    List<Appointment> findAdminRange(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("select a from Appointment a join fetch a.slot where a.patient.id = :patientId order by a.slot.appointmentDate desc, a.slot.appointmentTime desc")
    List<Appointment> findByPatientIdWithSlot(@Param("patientId") Long patientId);
}
