CREATE TABLE favorite_universities
(
    user_id                  VARCHAR(255) NOT NULL,
    created_at               datetime     NOT NULL,
    updated_at               datetime     NOT NULL,
    university_university_id BIGINT       NOT NULL,
    CONSTRAINT pk_favorite_universities PRIMARY KEY (user_id, university_university_id)
);

ALTER TABLE favorite_universities
    ADD CONSTRAINT FK_FAVORITE_UNIVERSITIES_ON_UNIVERSITY_UNIVERSITYID FOREIGN KEY (university_university_id) REFERENCES universities (university_id);