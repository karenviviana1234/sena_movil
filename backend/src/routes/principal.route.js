import { Router } from "express";
import { descargarPdf } from "../controllers/principal.js";
import { validarToken } from "../controllers/seguridad.controller.js";

export const Principal = Router()

Principal.get("/descargar", descargarPdf);