CREATE TABLE lessons (
                         id BIGSERIAL PRIMARY KEY,
                         title VARCHAR(200) NOT NULL,
                         description TEXT,
                         order_index INTEGER NOT NULL
);