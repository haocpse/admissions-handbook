ALTER TABLE `360b_school_database`.universities
    ADD verified BIT(1) NULL;

ALTER TABLE `360b_school_database`.universities
    MODIFY verified BIT(1) NOT NULL;