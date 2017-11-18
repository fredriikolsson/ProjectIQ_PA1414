-- MySQL Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: piq
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.16.04.1

CREATE DATABASE IF NOT EXISTS piq;
USE piq;

--
-- Table structure for table `Project`
--


CREATE TABLE IF NOT EXISTS `Project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `signDate` char(10) DEFAULT NULL,
  `deadline` char(10) DEFAULT NULL,
  `customer` varchar(50) DEFAULT NULL,
  `budget` int(11) DEFAULT NULL,
  `delivery` char(10) DEFAULT NULL,
  `purpose` longtext,
  `team` longtext,
  `technology` longtext,
  `owners` longtext,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  `userType` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Fredrik Olsson
--