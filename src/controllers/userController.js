import User from "../models/userModel.js";
import { userCreatedEvent } from "../services/rabbitServiceEvent.js";
import { sendEmail } from "../services/emailService.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import path from "path";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
};

export const createUser = async (req, res) => {
  const { password, username, phone, rol} = req.body;

  if (!phone || !username || !password) {
    return res.status(400).json({ message: "Teléfono, correo y contraseña son obligatorios" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: "El correo electrónico no es válido" });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "El teléfono debe contener exactamente 10 dígitos numéricos" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "La contraseña debe tener 8 o más caracteres" });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = await User.create({
      phone,
      username,
      password,
      rol: rol || 'cliente',
      status: true,
      creationDate: new Date(),
    });
    
    console.log(newUser);
    
    // Publicar el evento en RabbitMQ
    await userCreatedEvent({
      id: newUser.id,
      username: newUser.username,
      phone: newUser.phone,
      rol: newUser.rol, // Incluir el rol en el evento
      creationDate: newUser.creationDate,
    });

    // Enviar correo de bienvenida
    const templatePath = path.resolve("src/templates/welcomeEmail.html");
    await sendEmail(newUser.username, "¡Bienvenido a nuestra plataforma!", templatePath, {
      username: newUser.username,
    });

    return res.status(201).json({ message: "Usuario creado correctamente", data: newUser });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, phone } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (phone) {
      const phoneExists = await User.findOne({ where: { phone, id: { [Op.ne]: id } } });
      if (phoneExists) {
        return res.status(400).json({ message: "El teléfono ya está en uso" });
      }
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "El teléfono debe contener exactamente 10 dígitos numéricos" });
      }
    }

    const usernameExists = await User.findOne({ where: { username: user.username, id: { [Op.ne]: id } } });
    if (usernameExists) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    if (password && password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    await user.update({
      password: password ?? user.password,
      phone: phone ?? user.phone,
    });

    return res.status(200).json({ message: "Usuario actualizado correctamente", data: user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.update({ status: false });

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const SECRET_KEY = "aJksd9QzPl+sVdK7vYc/L4dK8HgQmPpQ5K9yApUsj3w=";

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({
      rol: user.rol
    }, SECRET_KEY, {
      subject: user.username,     // 👈 esto llena el "sub" para que Java pueda leerlo con getSubject()
      expiresIn: '1h'
    });
    
    
    

    return res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const resetLink = `http://localhost:5003/reset-password/${user.id}`;

    // Enviar correo de recuperación de contraseña
    const templatePath = path.resolve("src/templates/resetPassword.html");
    await sendEmail(user.username, "Recuperación de contraseña", templatePath, {
      username: user.username,
      resetLink,
    });

    return res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error al enviar correo de recuperación:", error);
    res.status(500).json({ message: "Error al enviar correo de recuperación" });
  }
};