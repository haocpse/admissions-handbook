ALTER TABLE standard_scores
    ADD score_type VARCHAR(255) NULL;

ALTER TABLE standard_scores
    ADD PRIMARY KEY (university_university_id, major_major_id, year, score_type);