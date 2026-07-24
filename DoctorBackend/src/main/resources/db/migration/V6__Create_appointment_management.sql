CREATE TABLE patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_code VARCHAR(24) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    normalized_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    guardian_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    notes TEXT,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    INDEX idx_patient_lookup (phone, normalized_name, date_of_birth),
    INDEX idx_patient_name (normalized_name)
);

CREATE TABLE appointment_slot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    capacity INT NOT NULL DEFAULT 6,
    booked_count INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_appointment_slot UNIQUE (appointment_date, appointment_time),
    CONSTRAINT chk_slot_capacity CHECK (capacity > 0),
    CONSTRAINT chk_slot_count CHECK (booked_count >= 0 AND booked_count <= capacity)
);

CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    reason_for_visit VARCHAR(500),
    status VARCHAR(30) NOT NULL,
    consumes_capacity BOOLEAN NOT NULL DEFAULT TRUE,
    arrived_at DATETIME(6),
    started_at DATETIME(6),
    completed_at DATETIME(6),
    cancelled_at DATETIME(6),
    admin_note TEXT,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(id),
    CONSTRAINT fk_appointment_slot FOREIGN KEY (slot_id) REFERENCES appointment_slot(id),
    INDEX idx_appointment_slot_capacity (slot_id, consumes_capacity),
    INDEX idx_appointment_status (status),
    INDEX idx_appointment_patient (patient_id)
);
