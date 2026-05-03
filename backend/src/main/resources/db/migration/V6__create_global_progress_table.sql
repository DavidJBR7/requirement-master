CREATE TABLE global_progress (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id BIGINT NOT NULL UNIQUE,
                                 xp_total INTEGER NOT NULL DEFAULT 0,
                                 lessons_completed INTEGER NOT NULL DEFAULT 0,
                                 total_lessons INTEGER NOT NULL DEFAULT 0,
                                 activities_completed INTEGER NOT NULL DEFAULT 0,
                                 total_activities INTEGER NOT NULL DEFAULT 0,
                                 average_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
                                 current_streak INTEGER NOT NULL DEFAULT 0,
                                 longest_streak INTEGER NOT NULL DEFAULT 0,
                                 last_activity_date TIMESTAMP,
                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);