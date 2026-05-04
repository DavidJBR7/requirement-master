CREATE TABLE global_progress (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id BIGINT NOT NULL UNIQUE,
                                 xp_total INT NOT NULL DEFAULT 0,
                                 lessons_completed INT NOT NULL DEFAULT 0,
                                 exam_passed BOOLEAN NOT NULL DEFAULT FALSE,
                                 last_activity_date TIMESTAMP,
                                 CONSTRAINT fk_gp_user FOREIGN KEY (user_id) REFERENCES users(id)
);