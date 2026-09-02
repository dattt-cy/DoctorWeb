ALTER TABLE visit_note
    ADD COLUMN follow_up_time TIME NULL AFTER follow_up_date,
    ADD COLUMN follow_up_appointment_id BIGINT NULL AFTER follow_up_time,
    ADD CONSTRAINT fk_visit_note_follow_up_appointment
        FOREIGN KEY (follow_up_appointment_id) REFERENCES appointment(id),
    ADD CONSTRAINT uk_visit_note_follow_up_appointment UNIQUE (follow_up_appointment_id),
    ADD INDEX idx_visit_note_follow_up_date (follow_up_date, status);

