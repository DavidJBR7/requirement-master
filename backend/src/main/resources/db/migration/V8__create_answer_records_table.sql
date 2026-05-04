CREATE TABLE answer_records (
                                id BIGSERIAL PRIMARY KEY,
                                activity_progress_id BIGINT NOT NULL,
                                question_id VARCHAR(255) NOT NULL,
                                user_answer TEXT,
                                correct BOOLEAN NOT NULL,
                                points_awarded INT NOT NULL,
                                xp_awarded INT NOT NULL,
                                CONSTRAINT fk_ar_progress FOREIGN KEY (activity_progress_id) REFERENCES activity_progress(id)
);