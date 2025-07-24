ALTER TABLE schedules
    ADD main_schedule BIT(1) NULL;

ALTER TABLE schedules
    MODIFY main_schedule BIT(1) NOT NULL;

ALTER TABLE favorites
    ADD CONSTRAINT uc_favorites_username UNIQUE (username);

DROP TABLE __efmigrationshistory;

ALTER TABLE schedules
    DROP COLUMN is_main_schedule;

ALTER TABLE universities
    MODIFY address VARCHAR(255) NOT NULL;

ALTER TABLE universities
    MODIFY thumbnail VARCHAR(255) NOT NULL;