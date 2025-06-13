CREATE TABLE major_combos
(
    active                               BIT(1)       NOT NULL,
    created_at                           datetime     NOT NULL,
    updated_at                           datetime     NOT NULL,
    university_university_id             BIGINT       NOT NULL,
    major_major_id                       BIGINT       NOT NULL,
    subject_combination_code_combination VARCHAR(255) NOT NULL,
    CONSTRAINT pk_major_combos PRIMARY KEY (university_university_id, major_major_id,
                                            subject_combination_code_combination)
);

ALTER TABLE major_combos
    ADD CONSTRAINT FK_MAJOR_COMBOS_ON_MAJOR_MAJORID FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE major_combos
    ADD CONSTRAINT FK_MAJOR_COMBOS_ON_SUBJECTCOMBINATION_CODECOMBINATION FOREIGN KEY (subject_combination_code_combination) REFERENCES subject_combinations (code_combination);

ALTER TABLE major_combos
    ADD CONSTRAINT FK_MAJOR_COMBOS_ON_UNIVERSITY_UNIVERSITYID FOREIGN KEY (university_university_id) REFERENCES universities (university_id);