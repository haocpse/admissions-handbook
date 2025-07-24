CREATE TABLE subject_combinations_subjects
(
    subject_combinations_code_combination VARCHAR(255) NOT NULL,
    subjects_subject_id                   BIGINT       NOT NULL
);

ALTER TABLE subject_combinations_subjects
    ADD CONSTRAINT fk_subcomsub_on_subject FOREIGN KEY (subjects_subject_id) REFERENCES subjects (subject_id);

ALTER TABLE subject_combinations_subjects
    ADD CONSTRAINT fk_subcomsub_on_subject_combination FOREIGN KEY (subject_combinations_code_combination) REFERENCES subject_combinations (code_combination);