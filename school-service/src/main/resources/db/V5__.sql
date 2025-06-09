ALTER TABLE standard_scores
    DROP FOREIGN KEY FK_STANDARD_SCORES_ON_MAJOR_MAJORID;

ALTER TABLE standard_scores
    DROP FOREIGN KEY FK_STANDARD_SCORES_ON_UNIVERSITY_UNIVERSITYID;

CREATE TABLE majors_subject_combinations
(
    major_major_id                        BIGINT       NOT NULL,
    subject_combinations_code_combination VARCHAR(255) NOT NULL
);

ALTER TABLE standard_scores
    ADD major_id BIGINT NULL;

ALTER TABLE standard_scores
    ADD note VARCHAR(255) NULL;

ALTER TABLE standard_scores
    ADD university_id BIGINT NULL;

ALTER TABLE standard_scores
    ADD CONSTRAINT FK_STANDARD_SCORES_ON_UNUNIDMAMAID FOREIGN KEY (university_university_id, major_major_id) REFERENCES university_majors (university_university_id, major_major_id);

ALTER TABLE majors_subject_combinations
    ADD CONSTRAINT fk_majsubcom_on_major FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE majors_subject_combinations
    ADD CONSTRAINT fk_majsubcom_on_subject_combination FOREIGN KEY (subject_combinations_code_combination) REFERENCES subject_combinations (code_combination);

ALTER TABLE university_majors
    MODIFY code_major VARCHAR(255) NULL;

ALTER TABLE standard_scores
    ADD PRIMARY KEY (university_id, major_id, year);