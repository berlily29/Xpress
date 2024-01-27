-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2023 at 10:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xpress`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Phone_Num` varchar(255) NOT NULL,
  `First_Name` char(255) NOT NULL,
  `Middle_Name` char(255) NOT NULL,
  `Last_Name` char(255) NOT NULL,
  `MPIN` varchar(255) NOT NULL,
  `Balance` decimal(60,2) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Phone_Num`, `First_Name`, `Middle_Name`, `Last_Name`, `MPIN`, `Balance`, `Address`, `Email`) VALUES
('01234567890', 'Keanna', 'Miranda', 'Laureles', '$2a$08$mZwTxBILHYZY1.ajN7TlxeYwtQugt/ga1ks2BqIWtZcBgvfOdU8yu', 6612.00, 'Gat', 'Laureles@gmail.com'),
('09132131441', 'Luise Gian', 'Miranda', 'Yammy', '$2a$08$KAzxxQxSV2eaUDSOwnwsBuL7jdYyIsxcQxufRqURdPbWHzmRYljJO', 88.20, 'Pob', 'YAMBAO@GMAIL.COM');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Phone_Num`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
