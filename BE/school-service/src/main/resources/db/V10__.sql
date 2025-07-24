CREATE TABLE standard_scores
(
    score                    DOUBLE       NOT NULL,
    note                     VARCHAR(255) NULL,
    created_at               datetime     NOT NULL,
    updated_at               datetime     NOT NULL,
    university_university_id BIGINT       NOT NULL,
    major_major_id           BIGINT       NOT NULL,
    year                     INT          NOT NULL,
    score_type               VARCHAR(255) NOT NULL,
    CONSTRAINT pk_standard_scores PRIMARY KEY (university_university_id, major_major_id, year, score_type)
);

ALTER TABLE standard_scores
    ADD CONSTRAINT FK_STANDARD_SCORES_ON_MAJOR_MAJORID FOREIGN KEY (major_major_id) REFERENCES majors (major_id);

ALTER TABLE standard_scores
    ADD CONSTRAINT FK_STANDARD_SCORES_ON_UNIVERSITY_UNIVERSITYID FOREIGN KEY (university_university_id) REFERENCES universities (university_id);