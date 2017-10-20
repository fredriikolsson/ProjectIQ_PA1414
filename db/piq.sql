CREATE DATABASE IF NOT EXISTS piq;

USE piq;

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(30) NOT NULL,
    pass LONGTEXT NOT NULL,
    accountType VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Project (
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(50),
    signDate DATE,
    deadline DATE,
    customer VARCHAR(50);
    budget INTEGER,
    delivery DATE,
    purpose LONGTEXT,
    team LONGTEXT,
    technology LONGTEXT
);
