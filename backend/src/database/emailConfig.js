// src/config/emailConfig.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: './src/env/.env' });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;
