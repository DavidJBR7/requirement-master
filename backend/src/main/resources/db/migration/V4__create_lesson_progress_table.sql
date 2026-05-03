CREATE TABLE lesson_progress (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id BIGINT NOT NULL,
                                 lesson_id BIGINT NOT NULL,
                                 completed BOOLEAN NOT NULL DEFAULT FALSE,
                                 started_at TIMESTAMP,
                                 completed_at TIMESTAMP,
                                 total_score INTEGER NOT NULL DEFAULT 0,
                                 total_activities INTEGER NOT NULL DEFAULT 0,
                                 completed_activities INTEGER NOT NULL DEFAULT 0,
                                 attempts INTEGER NOT NULL DEFAULT 0,
                                 last_activity_order INTEGER NOT NULL DEFAULT 0,
                                 UNIQUE (user_id, lesson_id),
                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                 FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);