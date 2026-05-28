import { Router } from "express";
import { pool }   from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// ── GET /api/estudiante/stats ──────────────────────────────────
// Stats reales del estudiante logueado
router.get("/stats", verifyToken, async (req, res) => {
  const id = req.usuario.id;
  try {
    // Tutoriales completados por este estudiante
    const [[{ completados }]] = await pool.query(
      `SELECT COUNT(*) AS completados
       FROM tutoriales_completados
       WHERE id_usuario = ?`,
      [id]
    );

    // Entrenamientos lanzados por este estudiante
    const [[{ entrenamientos }]] = await pool.query(
      `SELECT COUNT(*) AS entrenamientos
       FROM entrenamientos e
       JOIN modelos m ON e.id_modelo = m.id_modelo
       WHERE m.id_usuario = ?`,
      [id]
    );

    // Accuracy promedio de sus entrenamientos
    const [[{ accuracy }]] = await pool.query(
      `SELECT IFNULL(AVG(met.accuracy), 0) AS accuracy
       FROM metricas met
       JOIN entrenamientos e  ON met.id_entrenamiento = e.id_entrenamiento
       JOIN modelos m         ON e.id_modelo = m.id_modelo
       WHERE m.id_usuario = ?`,
      [id]
    );

    res.json({
      completados:    Number(completados),
      entrenamientos: Number(entrenamientos),
      accuracy:       Number(accuracy),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/estudiante/completados ───────────────────────────
// IDs de tutoriales que ya completó este estudiante
router.get("/completados", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_tutorial FROM tutoriales_completados WHERE id_usuario = ?`,
      [req.usuario.id]
    );
    res.json(rows.map((r) => r.id_tutorial));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/estudiante/completar/:id ────────────────────────
// Marcar un tutorial como completado
router.post("/completar/:id", verifyToken, async (req, res) => {
  try {
    await pool.query(
      `INSERT IGNORE INTO tutoriales_completados (id_usuario, id_tutorial)
       VALUES (?, ?)`,
      [req.usuario.id, req.params.id]
    );
    res.json({ message: "Tutorial completado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;