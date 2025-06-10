CREATE TABLE combo_subjects
(
    active                               BIT(1)       NOT NULL,
    created_at                           datetime     NOT NULL,
    updated_at                           datetime     NOT NULL,
    subject_combination_code_combination VARCHAR(255) NOT NULL,
    subject_subject_id                   BIGINT       NOT NULL,
    CONSTRAINT pk_combo_subjects PRIMARY KEY (subject_combination_code_combination, subject_subject_id)
);

CREATE TABLE major_combos
(
    active                               BIT(1)       NOT NULL,
    created_at                           datetime     NOT NULL,
    updated_at                           datetime     NOT NULL,
    major_major_id                       BIGINT       NOT NULL,
    subject_combination_code_combination VARCHAR(255) NOT NULL,
    CONSTRAINT pk_major_combos PRIMARY KEY (major_major_id, subject_combination_code_combination)
);

CREATE TABLE subject_combinations
(
    code_combination VARCHAR(255) NOT NULL,
    active           BIT(1)       NOT NULL,
    created_at       datetime     NOT NULL,
    updated_at       datetime     NOT NULL,
    CONSTRAINT pk_subject_combinations PRIMARY KEY (code_combination)
);

CREATE TABLE university_majors
(
    code_major               VARCHAR(255) NULL,
    tuition                  BIGINT       NULL,
    active                   BIT(1)       NOT NULL,
    created_at               datetime     NOT NULL,
    updated_at               datetime     NOT NULL,
    university_university_id BIGINT       NOT NULL,
    major_major_id           BIGINT       NOT NULL,
    CONSTRAINT pk_university_majors PRIMARY KEY (university_university_id, major_major_id)
);

ALTER TABLE combo_subjects
    ADD CONSTRAINT FK_COMBO_SUBJECTS_ON_SUBJECTCOMBINATION_CODECOMBINATION FOREIGN KEY (subject_combination_code_combination) REFERENCES subject_combinations (code_combination);

ALTER TABLE combo_subjects
    ADD CONSTRAINT FK_COMBO_SUBJECTS_ON_SUBJECT_SUBJECTID FOREIGN KEY (subject_subject_id) REFERENCES subjects (subject_id);

ALTER TABLE major_combos
    ADD CONSTRAINT FK_MAJOR_COMBOS_ON_MAJOR_MAJORID FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE major_combos
    ADD CONSTRAINT FK_MAJOR_COMBOS_ON_SUBJECTCOMBINATION_CODECOMBINATION FOREIGN KEY (subject_combination_code_combination) REFERENCES subject_combinations (code_combination);

ALTER TABLE university_majors
    ADD CONSTRAINT FK_UNIVERSITY_MAJORS_ON_MAJOR_MAJORID FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE university_majors
    ADD CONSTRAINT FK_UNIVERSITY_MAJORS_ON_UNIVERSITY_UNIVERSITYID FOREIGN KEY (university_university_id) REFERENCES universities (university_id);