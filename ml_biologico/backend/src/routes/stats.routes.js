import { Router } from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {

  try {

    // datasets
    const [datasets] = await pool.query(
      "SELECT COUNT(*) total FROM datasets"
    );

    // imágenes
    const [imagenes] = await pool.query(
      "SELECT COUNT(*) total FROM imagenes"
    );

    // usuarios
    const [usuarios] = await pool.query(
      "SELECT COUNT(*) total FROM usuarios"
    );

    res.json({
      datasets: datasets[0].total,
      imagenes: imagenes[0].total,
      usuarios: usuarios[0].total,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

export default router;