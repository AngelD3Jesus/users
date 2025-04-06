import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Cambia esto si usas otro proveedor
  auth: {
    user: process.env.EMAIL_USER, // Correo desde el archivo .env
    pass: process.env.EMAIL_PASS, // Contraseña o app password desde el archivo .env
  },
});

export const sendEmail = async (to, subject, templatePath, replacements) => {
  try {
    const template = fs.readFileSync(templatePath, "utf8");

    // Reemplaza las variables en la plantilla
    const html = Object.keys(replacements).reduce((acc, key) => {
      return acc.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    }, template);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};