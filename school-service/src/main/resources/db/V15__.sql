CREATE TABLE schedules
(
    schedule_id      BIGINT       NOT NULL,
    content          VARCHAR(255) NOT NULL,
    start_date       datetime     NOT NULL,
    end_date         datetime     NULL,
    note             VARCHAR(255) NULL,
    disable          BIT(1)       NOT NULL,
    is_main_schedule BIT(1)       NOT NULL,
    CONSTRAINT pk_schedules PRIMARY KEY (schedule_id)
);

ALTER TABLE universities
    ADD address VARCHAR(255) NULL;

ALTER TABLE universities
    ADD thumbnail VARCHAR(255) NULL;

ALTER TABLE universities
    MODIFY address VARCHAR(255) NOT NULL;

ALTER TABLE universities
    MODIFY thumbnail VARCHAR(255) NOT NULL;

ALTER TABLE favorites
    ADD username VARCHAR(255) NULL;

ALTER TABLE favorites
    MODIFY username VARCHAR(255) NOT NULL;

ALTER TABLE favorites
    ADD CONSTRAINT uc_favorites_username UNIQUE (username);

ALTER TABLE universities
    DROP COLUMN alias;

ALTER TABLE favorites
    DROP COLUMN user_id;