CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT,
    word VARCHAR(100),
    meaning TEXT,
    example TEXT
);

INSERT INTO categories(name)
VALUES
('Technology'),
('Business'),
('Travel'),
('Education'),
('Daily Life');


