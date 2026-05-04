CREATE TABLE activities (
                            id BIGSERIAL PRIMARY KEY,
                            lesson_id BIGINT NOT NULL,
                            title VARCHAR(200) NOT NULL,
                            description TEXT,
                            type VARCHAR(30) NOT NULL,
                            order_index INT NOT NULL,
                            max_score INT NOT NULL DEFAULT 100,
                            max_xp INT NOT NULL DEFAULT 10,
                            configuration JSONB,
                            CONSTRAINT fk_activity_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);