CREATE TABLE lesson_progress (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id BIGINT NOT NULL,
                                 lesson_id BIGINT NOT NULL,
                                 completed BOOLEAN NOT NULL DEFAULT FALSE,
                                 started_at TIMESTAMP,
                                 completed_at TIMESTAMP,
                                 total_score INT NOT NULL DEFAULT 0,
                                 best_score INT NOT NULL DEFAULT 0,
                                 total_xp_earned INT NOT NULL DEFAULT 0,
                                 total_activities INT NOT NULL DEFAULT 0,
                                 completed_activities INT NOT NULL DEFAULT 0,
                                 attempts INT NOT NULL DEFAULT 0,
                                 last_activity_order INT NOT NULL DEFAULT 0,
                                 finalized BOOLEAN NOT NULL DEFAULT FALSE,
                                 UNIQUE (user_id, lesson_id),
                                 CONSTRAINT fk_lp_user FOREIGN KEY (user_id) REFERENCES users(id),
                                 CONSTRAINT fk_lp_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);