import multer from 'multer';
import { pool } from '../database/conexion.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/novedad');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
export const cargarImage = upload.single('foto');

export const registrarNovedad = async (req, res) => {
    try {
        let foto = req.file ? req.file.originalname : null;
        let { descripcion, fecha, seguimiento, instructor } = req.body;

        // Validar que la fecha esté en el formato correcto 'YYYY-MM-DD'
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({ message: 'Formato de fecha incorrecto' });
        }

        if (!descripcion || !fecha || !seguimiento || !instructor) {
            return res.status(400).json({ message: 'Faltan datos en la solicitud' });
        }

        let sql = `INSERT INTO novedades (descripcion, fecha, foto, seguimiento, instructor) VALUES (?, ?, ?, ?, ?)`;
        const [rows] = await pool.query(sql, [descripcion, fecha, foto, seguimiento, instructor]);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Novedad registrada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al registrar la novedad'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error del servidor: ' + error.message
        });
    }
};

export const listar = async (req, res) => {
    try {
        let sql = "SELECT * FROM novedades"

        const [results] = await pool.query(sql)
        if(results.length>0){
            res.status(200).json(results)
        }else{
            res.status(404).json({
                message: 'No hay novedades registradas'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
};


export const listarnovedades = async (req, res) => {
    try {
        const { id_seguimiento } = req.params; // Obtén el ID del seguimiento desde los parámetros de la solicitud
        let sql = `SELECT id_novedad, seguimiento, fecha, instructor, descripcion, foto FROM novedades WHERE seguimiento = ?`; // Asegúrate de incluir la columna de imagen

        const [results] = await pool.query(sql, [id_seguimiento]);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({
                message: 'No hay novedades registradas para este seguimiento'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor: ' + error
        });
    }
};


export const actualizarNovedades = async (req, res) => {
    try {
        const { id } = req.params;
        let foto = req.file ? req.file.originalname : null;
        const { descripcion, fecha, seguimiento, instructor } = req.body;

        // Validar y formatear la fecha
        if (fecha && !isValidDate(fecha)) {
            return res.status(400).json({ message: 'Fecha no válida' });
        }
        const formattedDate = fecha ? new Date(fecha).toISOString().split('T')[0] : null;

        const [anterior] = await pool.query(`SELECT * FROM novedades WHERE id_novedad = ?`, [id]);

        let sql = `UPDATE novedades SET
                    descripcion = ?,
                    fecha = ?,
                    seguimiento = ?,
                    instructor = ?`;

        const params = [descripcion || anterior[0].descripcion, formattedDate || anterior[0].fecha, seguimiento || anterior[0].seguimiento, instructor || anterior[0].instructor];

        if (foto) {
            sql += `, foto = ?`;
            params.push(foto);
        }

        sql += ` WHERE id_novedad = ?`;
        params.push(id);

        const [rows] = await pool.query(sql, params);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'Novedad actualizada exitosamente'
            });
        } else {
            res.status(403).json({
                message: 'Error al actualizar la novedad'
            });
        }
    } catch (error) {
        console.error("Error del servidor:", error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

// Función para validar el formato de fecha
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    return dateString.match(regex) !== null;
};

export const eliminarNovedad = async (req, res) => {
    try {
        const { id_novedad } = req.params

        let sql = `DELETE FROM novedades WHERE id_novedad = ?`

        const [rows] = await pool.query(sql, [id_novedad])

        if (rows.affectedRows > 0) {
            res.status(200).json({
                message: 'novedad eliminada exitosamente'
            })
        } else {
            res.status(403).json({
                message: 'Error al eliminar la novedad'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor' + error
        })
    }
}