CREATE TABLE lessons (
                         id BIGSERIAL PRIMARY KEY,
                         title VARCHAR(200) NOT NULL,
                         description TEXT,
                         order_index INT NOT NULL,
                         is_exam BOOLEAN NOT NULL DEFAULT FALSE
);