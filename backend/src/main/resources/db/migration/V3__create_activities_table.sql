CREATE TABLE activities (
                            id BIGSERIAL PRIMARY KEY,
                            lesson_id BIGINT NOT NULL,
                            title VARCHAR(200) NOT NULL,
                            description TEXT,
                            type VARCHAR(30) NOT NULL,
                            difficulty VARCHAR(20) NOT NULL,
                            order_index INTEGER NOT NULL,
                            xp_reward INTEGER NOT NULL DEFAULT 10,
                            max_score INTEGER NOT NULL DEFAULT 100,
                            configuration JSONB,
                            FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);