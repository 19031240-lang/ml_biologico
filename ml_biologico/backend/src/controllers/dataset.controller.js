import { pool } from "../config/db.js";

// CREAR DATASET
export const createDataset = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const id_usuario = req.user.id; 

    const [result] = await pool.query(
      "INSERT INTO datasets (nombre, descripcion, id_usuario) VALUES (?, ?, ?)",
      [nombre, descripcion, id_usuario]
    );

    res.json({
      message: "Dataset creado",
      id: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// OBTENER DATASETS
export const getDatasets = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM datasets");
  res.json(rows);
};

// ELIMINAR DATASET
export const deleteDataset = async (req, res) => {
  await pool.query("DELETE FROM datasets WHERE id_dataset = ?", [
    req.params.id,
  ]);
  res.json({ message: "Dataset eliminado" });
};