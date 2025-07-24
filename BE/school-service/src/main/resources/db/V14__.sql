CREATE TABLE favorites
(
    favorite_university_id BIGINT       NOT NULL,
    university_id          BIGINT       NOT NULL,
    user_id                VARCHAR(255) NOT NULL,
    created_at             datetime     NOT NULL,
    updated_at             datetime     NOT NULL,
    CONSTRAINT pk_favorites PRIMARY KEY (favorite_university_id)
);

ALTER TABLE favorites
    ADD CONSTRAINT uc_favorites_user_university UNIQUE (user_id, university_id);

ALTER TABLE favorites
    ADD CONSTRAINT FK_FAVORITES_ON_UNIVERSITY FOREIGN KEY (university_id) REFERENCES universities (university_id);