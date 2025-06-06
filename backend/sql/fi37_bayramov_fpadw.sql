/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fi37_bayramov_fpadw
-- ------------------------------------------------------
-- Server version	10.11.13-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `fi37_bayramov_fpadw`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fi37_bayramov_fpadw` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `fi37_bayramov_fpadw`;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titel` varchar(255) NOT NULL,
  `zutaten` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`zutaten`)),
  `zubereitung` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`zubereitung`)),
  `bild_url` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `recipe_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
INSERT INTO `recipe` VALUES
(1,'Eier','[{\"zutat\":\"Ei\",\"menge\":\"2\",\"einheit\":\"Anzahl\"}]','[\"braten\",\"\"]','b0a9af2a397a0696766f9cbb6cc7b250',2,1,'2025-05-29 14:14:44'),
(2,'Spagetti','[{\"zutat\":\"Spagetti\",\"menge\":\"200\",\"einheit\":\"\"},{\"zutat\":\"Olivenöl\",\"menge\":\"3\",\"einheit\":\"Teelöffel\"},{\"zutat\":\"Knoblauch\",\"menge\":\"1\",\"einheit\":\"Anzahl\"}]','[\"Spagetti Kochen \",\"Knoblauch vorbereiten\",\"Olivenöl hinzufügen\"]','ab4ffd3af44dfe5f019605fcf4bf8f85',2,1,'2025-05-29 14:23:08'),
(5,'Nudelsalat','[{\"zutat\":\"Penne\",\"menge\":\"200\",\"einheit\":\"\"},{\"zutat\":\"Mayo\",\"menge\":\"3\",\"einheit\":\"Esslöffel\"},{\"zutat\":\"\",\"menge\":\"\",\"einheit\":\"Gramm\"}]','[\"Nudeln Kochen \",\"\"]','551571d3632a541717047fc20d0e1e21',2,0,'2025-05-29 14:39:56'),
(6,'Nudelsalat','[{\"zutat\":\"Penne\",\"menge\":\"200\",\"einheit\":\"\"},{\"zutat\":\"Mayo\",\"menge\":\"3\",\"einheit\":\"Esslöffel\"},{\"zutat\":\"Magie\",\"menge\":\"1\",\"einheit\":\"Kilogramm\"}]','[\"Nudeln Kochen \",\"hallo\",\"nein\"]','0c67a1654d939f0d2ede0bb50b47f7d7',2,0,'2025-05-29 14:43:44'),
(8,'halo','[{\"zutat\":\"mimimi\",\"menge\":\"12\",\"einheit\":\"\"},{\"zutat\":\"lulu\",\"menge\":\"20\",\"einheit\":\"Kilogramm\"}]','[\"lkjsnpcdc\",\"jjsjsjsj\"]','0fdd295b66a2fd6d521e322c8200cd62',2,0,'2025-06-03 10:54:29'),
(11,'Nudelsalat mit getrockneten Tomaten, Pinienkernen, Schafskäse und Basilikum','[{\"zutat\":\"Farfalle (Schmetterlingsnudeln)\",\"menge\":\"288\",\"einheit\":\"\"},{\"zutat\":\"Schafskäse \",\"menge\":\"200\",\"einheit\":\"Gramm\"}]','[\"Die Nudeln nach Packungsanweisung bissfest kochen.\\n\\nIn der Zwischenzeit die Tomaten klein schneiden und den Schafskäse würfeln. Den Knoblauch abziehen, durchpressen oder winzig klein schneiden. Die Pinienkerne vorsichtig in einer Pfanne ohne Fett anrösten (Vorsicht - sie werden schnell schwarz!). Die Basilikumblätter klein reißen oder schneiden.\\n\\nDie gekochten Nudeln abgießen und nun alles zusammen in eine Schüssel geben. Nun das Olivenöl (die Menge ist geschätzt) darüber geben und mit Salz und Pfeffer abschmecken.\"]','f915f83b0fb5310772d6a76a13c7f321',3,1,'2025-06-06 10:35:28'),
(12,'llllallal','[{\"zutat\":\"aööaö\",\"menge\":\"\",\"einheit\":\"\"}]','[\"aööaöa\"]','9c462e7b937d437ffedd4f6d3b8ee2e6',3,0,'2025-06-06 10:42:08');
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(2,'Adenus','Aydin','hanma89@gmail.com','$2b$10$oBrrW2WUR8bUj1jGDUtsOOJOYjQ5zeo1KzRWktnagYBUt1gNTcNHe'),
(3,'Adenus2','Aydin2','aaa@aaa.com','$2b$10$X31NqDAx75SRe.by29lz.Ox8gzVVGXu8zgzq3tWHuLyLfJHUlATXu');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06 14:51:30
