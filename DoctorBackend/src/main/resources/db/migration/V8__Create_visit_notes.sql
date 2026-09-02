CREATE TABLE visit_note (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    symptoms TEXT,
    examination TEXT,
    assessment TEXT,
    treatment_plan TEXT,
    follow_up_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    search_text TEXT,
    created_by VARCHAR(100) NOT NULL,
    finalized_at DATETIME(6),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_visit_note_appointment UNIQUE (appointment_id),
    CONSTRAINT fk_visit_note_patient FOREIGN KEY (patient_id) REFERENCES patient(id),
    CONSTRAINT fk_visit_note_appointment FOREIGN KEY (appointment_id) REFERENCES appointment(id),
    INDEX idx_visit_note_patient_date (patient_id, created_at),
    FULLTEXT INDEX ft_visit_note_search (search_text)
);

