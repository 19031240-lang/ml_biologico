import { pool } from "../config/db.js";


// OBTENER TODOS
export const getTutoriales = async (req, res) => {

  try {

    const [rows] = await pool.query(
      "SELECT * FROM tutoriales ORDER BY fecha_creacion DESC"
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};


// OBTENER UNO
export const getTutorial = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM tutoriales WHERE id_tutorial = ?",
      [id]
    );

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};


// CREAR
export const createTutorial = async (req, res) => {

  try {

    const { titulo, contenido } = req.body;

    const [result] = await pool.query(

      "INSERT INTO tutoriales (titulo, contenido) VALUES (?, ?)",

      [titulo, contenido]

    );

    res.json({
      message: "Tutorial creado",
      id: result.insertId,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};


// EDITAR
export const updateTutorial = async (req, res) => {

  try {

    const { id } = req.params;

    const { titulo, contenido } = req.body;

    await pool.query(

      `
      UPDATE tutoriales
      SET titulo = ?, contenido = ?
      WHERE id_tutorial = ?
      `,

      [titulo, contenido, id]

    );

    res.json({
      message: "Tutorial actualizado",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};


// ELIMINAR
export const deleteTutorial = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM tutoriales WHERE id_tutorial = ?",
      [id]
    );

    res.json({
      message: "Tutorial eliminado",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};