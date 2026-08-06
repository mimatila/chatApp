CREATE DATABASE chatApp;

USE chatApp;

CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    boardType VARCHAR(20) NOT NULL DEFAULT 'family',
    noticeTemplate VARCHAR(50) DEFAULT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    username VARCHAR(50),
    password VARCHAR(255),
    email VARCHAR(100),
    role VARCHAR(20),
    token VARCHAR(100),

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE boardMessages (
    id VARCHAR(36) PRIMARY KEY,
    board_id INT,
    author VARCHAR(50),
    time DATETIME,
    text TEXT,
    type VARCHAR(20),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    topic VARCHAR(100) DEFAULT NULL,
    header VARCHAR(255) DEFAULT NULL,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE pendingRequests (
    id VARCHAR(36) PRIMARY KEY,
    board_id INT,
    username VARCHAR(50),
    password VARCHAR(255),
    email VARCHAR(100),
    status VARCHAR(20),
    time DATETIME,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    autoDeleteDays INT,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE quickMessages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    message VARCHAR(100),

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE visitedUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    name VARCHAR(50),
    lastSeen BIGINT,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

CREATE TABLE defaultSaunaSlots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    time VARCHAR(20) NOT NULL
);

CREATE TABLE saunaSlots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    day VARCHAR(10) NOT NULL,
    time VARCHAR(20) NOT NULL,
    familyName VARCHAR(100) DEFAULT NULL,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);

INSERT INTO defaultSaunaSlots (day, time)
VALUES
('Ke','15:00-16:00'),
('Ke','16:00-17:00'),
('Ke','17:00-18:00'),
('Ke','18:00-19:00'),
('Ke','19:00-20:00'),
('Ke','20:00-21:00'),

('To','15:00-16:00'),
('To','16:00-17:00'),
('To','17:00-18:00'),
('To','18:00-19:00'),
('To','19:00-20:00'),
('To','20:00-21:00'),

('Pe','15:00-16:00'),
('Pe','16:00-17:00'),
('Pe','17:00-18:00'),
('Pe','18:00-19:00'),
('Pe','19:00-20:00'),
('Pe','20:00-21:00'),

('La','15:00-16:00'),
('La','16:00-17:00'),
('La','17:00-18:00'),
('La','18:00-19:00'),
('La','19:00-20:00'),
('La','20:00-21:00');
