import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { pool } from "../config/db.js";

const router = Router();

// SUBIR
router.post("/", verifyToken, upload.single("imagen"), uploadImage);

// OBTENER TODAS
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM imagenes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDITAR 
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id_dataset } = req.body;
    await pool.query(
      "UPDATE imagenes SET id_dataset = ? WHERE id_imagen = ?",
      [id_dataset, req.params.id]
    );
    res.json({ message: "Imagen actualizada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM imagenes WHERE id_imagen = ?", [req.params.id]);
    res.json({ message: "Imagen eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;