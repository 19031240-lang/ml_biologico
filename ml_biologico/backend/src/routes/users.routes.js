import { Router } from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// GET usuarios
router.get("/", verifyToken, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  res.json(rows);
});

// DELETE usuario
router.delete("/:id", verifyToken, async (req, res) => {
  await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [
    req.params.id,
  ]);
  res.json({ message: "Usuario eliminado" });
});

export default router;