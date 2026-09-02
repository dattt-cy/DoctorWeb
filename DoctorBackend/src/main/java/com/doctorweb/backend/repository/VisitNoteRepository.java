package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.VisitNote;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface VisitNoteRepository extends JpaRepository<VisitNote, Long> {
    @Query("select n from VisitNote n join fetch n.appointment a join fetch a.slot where a.id = :appointmentId")
    Optional<VisitNote> findByAppointmentId(@Param("appointmentId") Long appointmentId);

    @Query("select n from VisitNote n join fetch n.appointment a join fetch a.slot where n.patient.id = :patientId order by a.slot.appointmentDate desc, a.slot.appointmentTime desc")
    List<VisitNote> findByPatientId(@Param("patientId") Long patientId);

    @Query("""
            select n from VisitNote n
            join fetch n.patient
            join fetch n.appointment
            left join fetch n.followUpAppointment
            where n.followUpDate between :from and :to
            order by n.followUpDate, n.followUpTime, n.patient.fullName
            """)
    List<VisitNote> findFollowUps(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
