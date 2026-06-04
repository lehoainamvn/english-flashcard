CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
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

-- Tài khoản admin mặc định (password: admin123)
INSERT INTO users (username, email, password, role, created_at)
VALUES (
  'admin',
  'admin@admin.com',
  '$2a$10$M/XGPdSjF/rwNdfD2k5yK.QuDOfBUNr8iTChxyGE0gZjZn1VKfSxxe',
  'ADMIN',
  NOW()
);

INSERT INTO categories(name)
VALUES
('Technology'),
('Business'),
('Travel'),
('Education'),
('Daily Life');


