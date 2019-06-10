--
-- Table structure for table `build_links`
--

DROP TABLE IF EXISTS `build_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `build_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `build` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `builds`
--

DROP TABLE IF EXISTS `builds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `builds` (
  `build_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `class` varchar(16) NOT NULL,
  `slot` tinyint(4) NOT NULL,
  `build` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`build_id`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=644 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saved_items`
--

DROP TABLE IF EXISTS `saved_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saved_items` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(256) NOT NULL,
  `type` varchar(16) NOT NULL,
  `id` smallint(6) DEFAULT NULL,
  `i` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`idx`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;