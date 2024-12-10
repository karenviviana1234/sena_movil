import { Router } from 'express';
import { 
  registrarNovedad, 
  actualizarNovedades, 
  eliminarNovedad, 
  listarnovedades, 
  cargarImage,
  listar,
  listarWeb,
  listarnovedadesWeb
} from '../controllers/novedades.controller.js';
import { validarToken } from '../controllers/seguridad.controller.js';


const rutaNovedades = Router();

/* ....................WEB........................................... */
rutaNovedades.get('/listarN', /* validarToken, */ listarWeb);
rutaNovedades.get('/listar/:id_seguimiento', /* validarToken,  */listarnovedadesWeb);

/* ..............................Movil................................... */
rutaNovedades.get('/listarN/:id_seguimiento', validarToken, listar);
rutaNovedades.get('/listar/:identificacion', validarToken, listarnovedades);

rutaNovedades.post('/registrar', validarToken, cargarImage, registrarNovedad);
rutaNovedades.put('/actualizar/:id', validarToken, cargarImage, actualizarNovedades);
rutaNovedades.delete('/eliminar/:id_novedad', validarToken, eliminarNovedad);

export default rutaNovedades;