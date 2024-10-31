-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 12-08-2024 a las 04:07:27
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sena`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id_actividad` int NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ambientes`
--

CREATE TABLE `ambientes` (
  `id_ambiente` int NOT NULL,
  `nombre_amb` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id_area` int NOT NULL,
  `nombre_area` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id_area`, `nombre_area`) VALUES
(1, 'Tic');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones`
--

CREATE TABLE `asignaciones` (
  `id_asignacion` int NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  `instructor` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignaciones`
--

INSERT INTO `asignaciones` (`id_asignacion`, `fecha_inicio`, `fecha_fin`, `productiva`, `instructor`, `estado`) VALUES
(18, '2023-01-02', '2023-07-28', 5, 2, 'Inactivo'),
(19, '2023-05-01', '2023-05-31', 6, 2, 'Inactivo'),
(20, '2023-05-01', '2023-05-31', 6, 2, 'Inactivo'),
(21, '2023-05-01', '2023-05-31', 5, 2, 'Inactivo'),
(22, '2023-05-01', '2023-05-31', 6, 2, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacoras`
--

CREATE TABLE `bitacoras` (
  `id_bitacora` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `bitacora` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `seguimiento` int DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `instructor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bitacoras`
--

INSERT INTO `bitacoras` (`id_bitacora`, `fecha`, `bitacora`, `seguimiento`, `pdf`, `estado`, `instructor`) VALUES
(1, '2023-05-03', '1', 1, NULL, 'solicitud', 'Wilson Martinez Saldarriaga'),
(2, NULL, '2', 1, NULL, 'aprobado', 'Wilson Martinez Saldarriaga'),
(3, NULL, '1', 2, NULL, 'aprobado', 'Wilson Martinez S.'),
(4, NULL, '1', 3, NULL, 'no aprobado', 'Wilson Martinez'),
(5, '2023-05-16', '1', 4, NULL, 'aprobado', 'Wilson MArtinez S.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int NOT NULL,
  `razon_social` varchar(80) DEFAULT NULL,
  `direccion` varchar(80) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `municipio` int DEFAULT NULL,
  `jefe_inmediato` varchar(50) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `razon_social`, `direccion`, `telefono`, `correo`, `municipio`, `jefe_inmediato`, `estado`) VALUES
(3, 'Chaquira', 'car2', '3232332', NULL, 1, NULL, 'Activo'),
(4, '111', '111', '111', '11', 1, NULL, 'Inactivo'),
(5, '2222', '2222', '222', '222', 1, NULL, 'Inactivo'),
(6, '1111', '2222', '111', '111', 1, NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichas`
--

CREATE TABLE `fichas` (
  `codigo` int NOT NULL,
  `inicio_ficha` date DEFAULT NULL,
  `fin_lectiva` date DEFAULT NULL,
  `fin_ficha` datetime DEFAULT NULL,
  `programa` int DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `estado` enum('Lecttiva','Electiva','Finalizado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fichas`
--

INSERT INTO `fichas` (`codigo`, `inicio_ficha`, `fin_lectiva`, `fin_ficha`, `programa`, `sede`, `estado`) VALUES
(2692929, '2023-02-01', '2024-06-03', NULL, 1, 'yamboro', 'Electiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` int NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `dia` enum('lunes','martes','miercoles','jueves','viernes','sabados','domingo') DEFAULT NULL,
  `cantidad_horas` int DEFAULT NULL,
  `instructor` int DEFAULT NULL,
  `ficha` int DEFAULT NULL,
  `ambiente` int DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matriculas`
--

CREATE TABLE `matriculas` (
  `id_matricula` int NOT NULL,
  `ficha` int DEFAULT NULL,
  `aprendiz` int DEFAULT NULL,
  `estado` enum('Inducción','Formación','Condicionado','Cancelado','Retiro Voluntario','Por Certificar','Certificado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pendiente_tecnicos` int DEFAULT NULL,
  `pendiente_transversales` int DEFAULT NULL,
  `pendiente_ingles` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `matriculas`
--

INSERT INTO `matriculas` (`id_matricula`, `ficha`, `aprendiz`, `estado`, `pendiente_tecnicos`, `pendiente_transversales`, `pendiente_ingles`) VALUES
(13, 2692929, 3, 'Formación', 8, 2, 0),
(18, 2692929, 2, 'Formación', 8, 8, 8),
(20, 2692929, 8, 'Formación', 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int NOT NULL,
  `nombre_mpio` varchar(80) DEFAULT NULL,
  `departamento` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipios`
--

INSERT INTO `municipios` (`id_municipio`, `nombre_mpio`, `departamento`) VALUES
(1, 'Pitalito', 'Huila');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id_persona` int NOT NULL,
  `identificacion` bigint DEFAULT NULL,
  `nombres` varchar(80) DEFAULT NULL,
  `correo` varchar(80) DEFAULT NULL,
  `telefono` varchar(40) DEFAULT NULL,
  `password` varchar(25) DEFAULT NULL,
  `rol` enum('Instructor','Coordinador','Lider','Seguimiento','Aprendiz') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cargo` enum('Instructor','Aprendiz','Coordinador','Administrativo') DEFAULT NULL,
  `municipio` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id_persona`, `identificacion`, `nombres`, `correo`, `telefono`, `password`, `rol`, `cargo`, `municipio`) VALUES
(2, 96361787, 'Wilson Martinez Saldarriaga', '1111', '1111', '123', 'Instructor', 'Instructor', 1),
(3, 12345, 'Juan Jose ', 'wilson@hotmail.com', '321223312', '1234', NULL, 'Aprendiz', 1),
(4, 123, '123', '123', '123', NULL, NULL, NULL, 1),
(5, 1234, '1234', '1234', '1234', NULL, NULL, NULL, 1),
(6, 13232321, '13123', '213123', '2123213', NULL, NULL, NULL, 1),
(7, 21212, '12121', '1212', '12121', NULL, NULL, NULL, 1),
(8, 123456, 'Maria del Pilar', 'maria@gmail.com', '11211', NULL, NULL, 'Aprendiz', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productiva`
--

CREATE TABLE `productiva` (
  `id_productiva` int NOT NULL,
  `matricula` int DEFAULT NULL,
  `empresa` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `alternativa` enum('Contrato de Aprendizaje','Proyecto Productivo','Pasantias','Monitoria') DEFAULT NULL,
  `estado` enum('Inicio','Renuncia','Terminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acuerdo` varchar(100) DEFAULT NULL,
  `arl` varchar(100) DEFAULT NULL,
  `consulta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aprendiz` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productiva`
--

INSERT INTO `productiva` (`id_productiva`, `matricula`, `empresa`, `fecha_inicio`, `fecha_fin`, `alternativa`, `estado`, `acuerdo`, `arl`, `consulta`, `aprendiz`) VALUES
(5, 13, 6, '2023-01-02', '2023-04-29', 'Proyecto Productivo', 'Inicio', 'GD-F-007_Formato_de_Acta_WilsonMartinezSaldarriaga.pdf', 'Imagen1(1).png', 'ciclos.gif', NULL),
(6, 20, 3, '2023-04-03', '2023-10-31', 'Contrato de Aprendizaje', 'Inicio', 'img20230331_15561888.pdf', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id_programa` int NOT NULL,
  `nombre_programa` varchar(80) DEFAULT NULL,
  `sigla` varchar(20) DEFAULT NULL,
  `nivel` enum('Tecnico','Tecnólogo') DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programas`
--

INSERT INTO `programas` (`id_programa`, `nombre_programa`, `sigla`, `nivel`, `estado`) VALUES
(1, 'Tecnologo en Analisis y Desarrollo de Software', 'ADSO', 'Tecnólogo', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimientos`
--

CREATE TABLE `seguimientos` (
  `id_seguimiento` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `seguimiento` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('solicitud','aprobado','no aprobado') DEFAULT NULL,
  `pdf` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `productiva` int DEFAULT NULL,
  `instructor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguimientos`
--

INSERT INTO `seguimientos` (`id_seguimiento`, `fecha`, `seguimiento`, `estado`, `pdf`, `productiva`, `instructor`) VALUES
(1, '2023-05-03', '1', NULL, NULL, NULL, NULL),
(2, '2023-05-03', '2', 'aprobado', NULL, NULL, NULL),
(3, '2023-05-03', '3', 'no aprobado', NULL, NULL, NULL),
(4, '2023-05-09', '1', 'solicitud', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vinculacion`
--

CREATE TABLE `vinculacion` (
  `id_vinculacion` int NOT NULL,
  `instructor` int DEFAULT NULL,
  `tipo` enum('contratisca','planta') DEFAULT NULL,
  `sede` enum('centro','yamboro') DEFAULT NULL,
  `area` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vinculacion`
--

INSERT INTO `vinculacion` (`id_vinculacion`, `instructor`, `tipo`, `sede`, `area`, `estado`) VALUES
(2, 2, 'contratisca', 'yamboro', 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `actividad_seguimiento` (`seguimiento`);

--
-- Indices de la tabla `ambientes`
--
ALTER TABLE `ambientes`
  ADD PRIMARY KEY (`id_ambiente`),
  ADD KEY `municipio_ambiente` (`municipio`);

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id_area`);

--
-- Indices de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `asignacion_vinculacacion` (`instructor`),
  ADD KEY `asignacion_practica` (`productiva`);

--
-- Indices de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `seguimiento_bitacora` (`seguimiento`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD KEY `empresa_minicipio` (`municipio`);

--
-- Indices de la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `ficha_programa` (`programa`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `hoario_ambiente` (`ambiente`),
  ADD KEY `horario_ficha` (`ficha`),
  ADD KEY `vinculacion_horario` (`instructor`);

--
-- Indices de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD PRIMARY KEY (`id_matricula`),
  ADD UNIQUE KEY `uiniquematricula` (`ficha`,`aprendiz`),
  ADD KEY `matriculas_personas` (`aprendiz`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id_persona`),
  ADD UNIQUE KEY `identificacion_unique` (`identificacion`),
  ADD KEY `persona_municipio` (`municipio`);

--
-- Indices de la tabla `productiva`
--
ALTER TABLE `productiva`
  ADD PRIMARY KEY (`id_productiva`),
  ADD KEY `aprendiz_matricula` (`matricula`),
  ADD KEY `empresa_matricula` (`empresa`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id_programa`);

--
-- Indices de la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  ADD PRIMARY KEY (`id_seguimiento`),
  ADD KEY `seguimiento_instructor` (`instructor`),
  ADD KEY `seguimiento_productiva` (`productiva`);

--
-- Indices de la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD PRIMARY KEY (`id_vinculacion`),
  ADD KEY `vinculacion_horario` (`instructor`),
  ADD KEY `vinculacion_area` (`area`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_actividad` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ambientes`
--
ALTER TABLE `ambientes`
  MODIFY `id_ambiente` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `areas`
--
ALTER TABLE `areas`
  MODIFY `id_area` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  MODIFY `id_asignacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  MODIFY `id_bitacora` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `matriculas`
--
ALTER TABLE `matriculas`
  MODIFY `id_matricula` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id_persona` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `productiva`
--
ALTER TABLE `productiva`
  MODIFY `id_productiva` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id_programa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  MODIFY `id_seguimiento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  MODIFY `id_vinculacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `seguimiento_actividad` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`);

--
-- Filtros para la tabla `ambientes`
--
ALTER TABLE `ambientes`
  ADD CONSTRAINT `municipio_ambiente` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD CONSTRAINT `asignacion_practica` FOREIGN KEY (`productiva`) REFERENCES `productiva` (`id_productiva`),
  ADD CONSTRAINT `asignacion_vinculacacion` FOREIGN KEY (`instructor`) REFERENCES `vinculacion` (`id_vinculacion`);

--
-- Filtros para la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD CONSTRAINT `seguimiento_bitacora` FOREIGN KEY (`seguimiento`) REFERENCES `seguimientos` (`id_seguimiento`);

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `empresa_minicipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD CONSTRAINT `ficha_programa` FOREIGN KEY (`programa`) REFERENCES `programas` (`id_programa`);

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `hoario_ambiente` FOREIGN KEY (`ambiente`) REFERENCES `ambientes` (`id_ambiente`),
  ADD CONSTRAINT `horario_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`),
  ADD CONSTRAINT `vinculacion_horario` FOREIGN KEY (`instructor`) REFERENCES `vinculacion` (`id_vinculacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `matriculas`
--
ALTER TABLE `matriculas`
  ADD CONSTRAINT `matricula_ficha` FOREIGN KEY (`ficha`) REFERENCES `fichas` (`codigo`),
  ADD CONSTRAINT `matriculas_personas` FOREIGN KEY (`aprendiz`) REFERENCES `personas` (`id_persona`);

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `persona_municipio` FOREIGN KEY (`municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `productiva`
--
ALTER TABLE `productiva`
  ADD CONSTRAINT `empresa_matricula` FOREIGN KEY (`empresa`) REFERENCES `empresa` (`id_empresa`),
  ADD CONSTRAINT `practica_aprendiz` FOREIGN KEY (`matricula`) REFERENCES `matriculas` (`id_matricula`);

--
-- Filtros para la tabla `seguimientos`
--
ALTER TABLE `seguimientos`
  ADD CONSTRAINT `seguimiento_productiva` FOREIGN KEY (`productiva`) REFERENCES `productiva` (`id_productiva`);

--
-- Filtros para la tabla `vinculacion`
--
ALTER TABLE `vinculacion`
  ADD CONSTRAINT `vinculacion_area` FOREIGN KEY (`area`) REFERENCES `areas` (`id_area`),
  ADD CONSTRAINT `vinculacion_instructor` FOREIGN KEY (`instructor`) REFERENCES `personas` (`id_persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
