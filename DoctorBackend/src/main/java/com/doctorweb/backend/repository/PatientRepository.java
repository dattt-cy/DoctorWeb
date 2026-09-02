package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.Patient;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findFirstByPhoneAndNormalizedName(String phone, String normalizedName);
    @Query("""
            select distinct p from Patient p
            where p.normalizedName like concat('%', :normalized, '%')
               or p.phone like concat('%', :phone, '%')
               or upper(p.patientCode) like concat('%', :code, '%')
               or lower(coalesce(p.notes, '')) like concat('%', :raw, '%')
               or exists (select n.id from VisitNote n
                          where n.patient = p and lower(coalesce(n.searchText, '')) like concat('%', :normalized, '%'))
            """)
    Page<Patient> search(@Param("normalized") String normalized,
                         @Param("phone") String phone,
                         @Param("code") String code,
                         @Param("raw") String raw,
                         Pageable pageable);

    default Page<Patient> search(String normalized, String phone, String code, Pageable pageable) {
        return search(normalized, phone, code, normalized, pageable);
    }
}
