CREATE TABLE majors
(
    major_id   BIGINT       NOT NULL,
    major_name VARCHAR(255) NOT NULL,
    active     BIT(1)       NOT NULL,
    created_at datetime     NOT NULL,
    updated_at datetime     NOT NULL,
    CONSTRAINT pk_majors PRIMARY KEY (major_id)
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

ALTER TABLE majors
    ADD CONSTRAINT uc_majors_majorname UNIQUE (major_name);

ALTER TABLE subjects
    ADD CONSTRAINT uc_subjects_subjectname UNIQUE (subject_name);

ALTER TABLE universities
    ADD CONSTRAINT uc_universities_universityname UNIQUE (university_name);