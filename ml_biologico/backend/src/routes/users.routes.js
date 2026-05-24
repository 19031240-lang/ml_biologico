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

// UPDATE rol usuario
router.put("/:id", verifyToken, async (req, res) => {
  const { id_rol } = req.body;
  await pool.query(
    "UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?",
    [id_rol, req.params.id]
  );
  res.json({ message: "Rol actualizado" });
});
export default router;