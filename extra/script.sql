CREATE DATABASE examenml;
USE examenml;

DROP TABLE IF EXISTS `dna`;
CREATE TABLE `dna` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `sequence` varchar(200) NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=latin1;