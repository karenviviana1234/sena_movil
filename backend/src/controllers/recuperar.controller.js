import { pool } from "../database/conexion.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../database/emailConfig.js";
import dotenv from "dotenv";

dotenv.config({ path: './src/env/.env' });  // Cargar las variables de entorno

// Generar y enviar el token de recuperación de contraseña
export const tokenPassword = async (req, res) => {
    try {
        const { correo } = req.body;
        
        // Verificar si el correo existe en la tabla personas
        const sql = `SELECT * FROM personas WHERE correo = ?`;
        const [user] = await pool.query(sql, [correo]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Genera un token de recuperación usando la clave JWT secreta del .env
        const token = jwt.sign(
            { identificacion: user[0].identificacion },
            process.env.AUT_SECRET,  // Se usa la clave secreta desde .env
            { expiresIn: process.env.AUT_EXPIRE }  // Expiración configurada en .env
        );

        // Guardar el token y su tiempo de expiración en la base de datos
        const expires = new Date(Date.now() + 3600000); // Expira en 1 hora
        await pool.query(
            `UPDATE personas SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE correo = ?`,
            [token, expires, correo]
        );

        // Opciones para el correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Correo remitente desde .env
            to: user[0].correo,
            subject: "Restablecer Contraseña Crop Link",
            html: `
                <p>Estimado Usuario,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Para proceder, por favor haz clic en el botón a continuación:</p>
                <a href="http://localhost:0.0.0.0/password/cambiar?token=${token}" style="background-color: #006000; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Restablecer Contraseña</a>
                <p>Si no has solicitado un cambio de contraseña, puedes ignorar este correo con seguridad.</p>
                <p>Gracias,<br>El equipo de Crop Link</p>
            
            `,
         
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado exitosamente" });

    } catch (error) {
        res.status(500).json({ message: "No se pudo enviar el correo", error: error.message });
    }
};

// Restablecer la contraseña usando el token de recuperación
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verifica si el token es válido y aún no ha expirado
        const sql = `SELECT * FROM personas WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()`;
        const [user] = await pool.query(sql, [token]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }

        // Hashea la nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Actualiza la contraseña en la base de datos y elimina el token
        const sqlUpdate = `UPDATE personas SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id_persona = ?`;
        const [actualizar] = await pool.query(sqlUpdate, [hashedPassword, user[0].id_persona]);

        if (actualizar.affectedRows > 0) {
            return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
        } else {
            return res.status(400).json({ message: "No se pudo actualizar la contraseña" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
    }
};
