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
    signDate CHAR(10),
    deadline CHAR(10),
    customer VARCHAR(50),
    budget INTEGER,
    delivery CHAR(10),
    purpose LONGTEXT,
    team LONGTEXT,
    technology LONGTEXT,
    owners LONGTEXT
);

UPDATE Project SET owners = 'fredde665@gmail.com' WHERE id > 0;


-- WORKING ADMIN TOOL
-- UPDATE Project SET owners = CONCAT(owners, ',4') WHERE id = 4;

-- WORKING SEARCH ALGORITHM
SELECT * FROM Project WHERE technology LIKE '%Keyboard%';
-- SELECT * FROM Project;
-- CREATE TABLE IF NOT EXISTS Owners (
-- 	id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
--     tableId INTEGER NOT NULL,
--     ownersId TEXT
-- );
-- 

-- DELIMITER //
-- 
-- CREATE PROCEDURE showMyProjects(
-- 	currentUser INTEGER
-- )
-- 
-- BEGIN 
-- DECLARE doesExists BOOLEAN;
-- 
-- START TRANSACTION;
-- SET doesEcists = FALSE;
-- SET @counter = 1;
-- SET @owners = (SELECT owners FROM Project WHERE id = moverId);
-- SET @accountExists = substring_index(substring_index(@aHolderList, ',', @counter), ',', -1);
-- 
-- 
-- 
-- 
-- 
-- END //