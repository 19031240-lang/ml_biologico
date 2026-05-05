import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { nombre, email, password, id_rol } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hash, id_rol]
    );

    res.json({ message: "Usuario registrado", id: result.insertId });
  } catch (error) {
  console.log(error)
  res.status(500).json({ error: error.message });
}
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};