CREATE TABLE majors
(
    major_id   BIGINT       NOT NULL,
    major_name VARCHAR(255) NOT NULL,
    active     BIT(1)       NOT NULL,
    created_at datetime     NOT NULL,
    updated_at datetime     NOT NULL,
    CONSTRAINT pk_majors PRIMARY KEY (major_id)
);

CREATE TABLE standard_scores
(
    score         DOUBLE   NOT NULL,
    created_at    datetime NOT NULL,
    updated_at    datetime NOT NULL,
    university_id BIGINT   NOT NULL,
    major_id      BIGINT   NOT NULL,
    year          INT      NOT NULL,
    CONSTRAINT pk_standard_scores PRIMARY KEY (university_id, major_id, year)
);

CREATE TABLE subject_combinations
(
    code_combination VARCHAR(255) NOT NULL,
    active           BIT(1)       NOT NULL,
    created_at       datetime     NOT NULL,
    updated_at       datetime     NOT NULL,
    CONSTRAINT pk_subject_combinations PRIMARY KEY (code_combination)
);

CREATE TABLE subject_combinations_subjects
(
    subject_combinations_code_combination VARCHAR(255) NOT NULL,
    subjects_subject_id                   BIGINT       NOT NULL
);

CREATE TABLE subjects
(
    subject_id   BIGINT       NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    active       BIT(1)       NOT NULL,
    created_at   datetime     NOT NULL,
    updated_at   datetime     NOT NULL,
    CONSTRAINT pk_subjects PRIMARY KEY (subject_id)
);

CREATE TABLE universities
(
    university_id   BIGINT       NOT NULL,
    university_name VARCHAR(255) NOT NULL,
    code            VARCHAR(255) NOT NULL,
    alias           VARCHAR(255) NOT NULL,
    main            VARCHAR(255) NOT NULL,
    active          BIT(1)       NOT NULL,
    created_at      datetime     NOT NULL,
    updated_at      datetime     NOT NULL,
    CONSTRAINT pk_universities PRIMARY KEY (university_id)
);

CREATE TABLE university_majors
(
    code_major               VARCHAR(255) NOT NULL,
    active                   BIT(1)       NOT NULL,
    created_at               datetime     NOT NULL,
    updated_at               datetime     NOT NULL,
    university_university_id BIGINT       NOT NULL,
    major_major_id           BIGINT       NOT NULL,
    CONSTRAINT pk_university_majors PRIMARY KEY (university_university_id, major_major_id)
);

ALTER TABLE majors
    ADD CONSTRAINT uc_majors_majorname UNIQUE (major_name);

ALTER TABLE subjects
    ADD CONSTRAINT uc_subjects_subjectname UNIQUE (subject_name);

ALTER TABLE universities
    ADD CONSTRAINT uc_universities_universityname UNIQUE (university_name);

ALTER TABLE university_majors
    ADD CONSTRAINT FK_UNIVERSITY_MAJORS_ON_MAJOR_MAJORID FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE university_majors
    ADD CONSTRAINT FK_UNIVERSITY_MAJORS_ON_UNIVERSITY_UNIVERSITYID FOREIGN KEY (university_university_id) REFERENCES universities (university_id);

ALTER TABLE subject_combinations_subjects
    ADD CONSTRAINT fk_subcomsub_on_subject FOREIGN KEY (subjects_subject_id) REFERENCES subjects (subject_id);

ALTER TABLE subject_combinations_subjects
    ADD CONSTRAINT fk_subcomsub_on_subject_combination FOREIGN KEY (subject_combinations_code_combination) REFERENCES subject_combinations (code_combination);