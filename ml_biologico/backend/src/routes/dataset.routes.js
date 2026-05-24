import { Router } from "express";
import { createDataset, deleteDataset } from "../controllers/dataset.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { pool } from "../config/db.js";

const router = Router();

// CREAR
router.post("/", verifyToken, createDataset);

// OBTENER TODOS
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*,
        (SELECT url FROM imagenes WHERE id_dataset = d.id_dataset LIMIT 1) imagen
      FROM datasets d
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDITAR
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    await pool.query(
      "UPDATE datasets SET nombre = ?, descripcion = ? WHERE id_dataset = ?",
      [nombre, descripcion, req.params.id]
    );
    res.json({ message: "Dataset actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR
router.delete("/:id", verifyToken, deleteDataset);

export default router;