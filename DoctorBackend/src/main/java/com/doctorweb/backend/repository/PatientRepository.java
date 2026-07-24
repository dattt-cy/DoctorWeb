package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.Patient;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findFirstByPhoneAndNormalizedName(String phone, String normalizedName);
    Page<Patient> findByNormalizedNameContainingOrPhoneContainingOrPatientCodeContaining(
            String name, String phone, String code, Pageable pageable);
}
