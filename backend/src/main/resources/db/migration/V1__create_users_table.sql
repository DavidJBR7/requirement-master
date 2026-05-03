CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       full_name VARCHAR(100) NOT NULL,
                       username VARCHAR(100) NOT NULL UNIQUE,
                       enabled BOOLEAN NOT NULL DEFAULT TRUE,
                       credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE
);