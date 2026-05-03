CREATE TABLE activity_progress (
                                   id BIGSERIAL PRIMARY KEY,
                                   user_id BIGINT NOT NULL,
                                   activity_id BIGINT NOT NULL,
                                   completed BOOLEAN NOT NULL DEFAULT FALSE,
                                   score INTEGER NOT NULL DEFAULT 0,
                                   attempts INTEGER NOT NULL DEFAULT 0,
                                   time_taken_seconds INTEGER,
                                   last_attempt_at TIMESTAMP,
                                   UNIQUE (user_id, activity_id),
                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                   FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);