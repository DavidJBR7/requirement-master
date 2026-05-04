CREATE TABLE activity_progress (
                                   id BIGSERIAL PRIMARY KEY,
                                   user_id BIGINT NOT NULL,
                                   activity_id BIGINT NOT NULL,
                                   completed BOOLEAN NOT NULL DEFAULT FALSE,
                                   score INT NOT NULL DEFAULT 0,
                                   xp_earned INT NOT NULL DEFAULT 0,
                                   attempts INT NOT NULL DEFAULT 0,
                                   time_taken_seconds INT,
                                   last_attempt_at TIMESTAMP,
                                   UNIQUE (user_id, activity_id),
                                   CONSTRAINT fk_ap_user FOREIGN KEY (user_id) REFERENCES users(id),
                                   CONSTRAINT fk_ap_activity FOREIGN KEY (activity_id) REFERENCES activities(id)
);