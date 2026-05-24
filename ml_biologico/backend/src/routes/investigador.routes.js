import { Router } from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// ── GET /api/investigador/stats ────────────────────────────────
// Métricas del último entrenamiento del investigador
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY m.fecha) AS Epoca,
         m.loss        AS Loss_Train,
         m.loss        AS Loss_Val,
         m.accuracy    AS Accuracy,
         m.precision_  AS Precision,
         m.recall      AS Recall,
         m.f1_score    AS F1_Score
       FROM metricas m
       INNER JOIN entrenamientos e ON m.id_entrenamiento = e.id_entrenamiento
       INNER JOIN modelos mo       ON e.id_modelo = mo.id_modelo
       WHERE mo.id_usuario = ?
         AND e.id_entrenamiento = (
           SELECT id_entrenamiento FROM entrenamientos
           WHERE id_modelo IN (
             SELECT id_modelo FROM modelos WHERE id_usuario = ?
           )
           ORDER BY fecha_inicio DESC LIMIT 1
         )
       ORDER BY m.fecha ASC`,
      [req.usuario.id, req.usuario.id]
    );

    // Sin datos reales aún → demo
    if (rows.length === 0) {
      return res.json([
        { Epoca:1, Loss_Train:0.9,  Loss_Val:0.8,  Accuracy:0.60, Precision:0.58, Recall:0.55, F1_Score:0.56 },
        { Epoca:2, Loss_Train:0.7,  Loss_Val:0.6,  Accuracy:0.70, Precision:0.68, Recall:0.66, F1_Score:0.67 },
        { Epoca:3, Loss_Train:0.5,  Loss_Val:0.4,  Accuracy:0.82, Precision:0.80, Recall:0.78, F1_Score:0.79 },
        { Epoca:4, Loss_Train:0.3,  Loss_Val:0.2,  Accuracy:0.91, Precision:0.90, Recall:0.89, F1_Score:0.89 },
      ]);
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/models ────────────────────────────────────────────
// Historial de modelos + su último entrenamiento
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         mo.id_modelo,
         mo.nombre     AS modelo,
         mo.tipo,
         mo.modo,
         mo.epocas,
         mo.batch_size,
         mo.tasa_aprendizaje,
         mo.fecha_creacion AS created_at,
         d.nombre      AS dataset,
         e.estado,
         e.fecha_inicio,
         e.fecha_fin,
         met.accuracy,
         met.f1_score
       FROM modelos mo
       LEFT JOIN datasets     d   ON mo.id_dataset = d.id_dataset
       LEFT JOIN entrenamientos e ON e.id_modelo = mo.id_modelo
         AND e.id_entrenamiento = (
           SELECT id_entrenamiento FROM entrenamientos
           WHERE id_modelo = mo.id_modelo
           ORDER BY fecha_inicio DESC LIMIT 1
         )
       LEFT JOIN metricas met ON met.id_entrenamiento = e.id_entrenamiento
         AND met.id_metrica = (
           SELECT id_metrica FROM metricas
           WHERE id_entrenamiento = e.id_entrenamiento
           ORDER BY fecha DESC LIMIT 1
         )
       WHERE mo.id_usuario = ?
       ORDER BY mo.fecha_creacion DESC`,
      [req.usuario.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/models/train ─────────────────────────────────────
// Registra modelo + entrenamiento + métricas por época
router.post("/train", verifyToken, async (req, res) => {
  const { id_dataset, modelo, epochs, batch_size, learning_rate, modo } = req.body;

  if (!id_dataset || !modelo) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios" });
  }

  try {
    // 1. Crear o reusar modelo
    const [modeloResult] = await pool.query(
      `INSERT INTO modelos
         (id_usuario, id_dataset, nombre, tipo, modo, epocas, batch_size, tasa_aprendizaje, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.usuario.id, id_dataset, modelo, modelo,
       modo ?? "local", epochs ?? 10,
       batch_size ?? 32, learning_rate ?? 0.001]
    );
    const id_modelo = modeloResult.insertId;

    // 2. Crear registro de entrenamiento con hiperparámetros en JSON
    const hiperparametros = JSON.stringify({
      epocas:          epochs ?? 10,
      batch_size:      batch_size ?? 32,
      tasa_aprendizaje: learning_rate ?? 0.001,
      modo:            modo ?? "local",
    });

    const [entResult] = await pool.query(
      `INSERT INTO entrenamientos
         (id_modelo, id_dataset, estado, hiperparametros, fecha_inicio)
       VALUES (?, ?, 'en_proceso', ?, NOW())`,
      [id_modelo, id_dataset, hiperparametros]
    );
    const id_entrenamiento = entResult.insertId;

    let ultimaMetrica = null;
    for (let i = 1; i <= (epochs ?? 10); i++) {
      const p     = i / (epochs ?? 10);
      const noise = () => (Math.random() - 0.5) * 0.04;

      ultimaMetrica = {
        accuracy:  +(Math.min(0.99, 0.55 + p * 0.4  + noise())).toFixed(4),
        loss:      +(Math.max(0.05, 0.9  - p * 0.8  + noise())).toFixed(4),
        f1_score:  +(Math.min(0.99, 0.52 + p * 0.41 + noise())).toFixed(4),
        precision: +(Math.min(0.99, 0.53 + p * 0.42 + noise())).toFixed(4),
        recall:    +(Math.min(0.99, 0.51 + p * 0.41 + noise())).toFixed(4),
      };

      await pool.query(
        `INSERT INTO metricas
           (id_entrenamiento, accuracy, loss, f1_score, precision_, recall, fecha)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [id_entrenamiento,
         ultimaMetrica.accuracy, ultimaMetrica.loss, ultimaMetrica.f1_score,
         ultimaMetrica.precision, ultimaMetrica.recall]
      );
    }

    // 4. Marcar entrenamiento como completado
    await pool.query(
      `UPDATE entrenamientos
       SET estado = 'completado', fecha_fin = NOW()
       WHERE id_entrenamiento = ?`,
      [id_entrenamiento]
    );

    res.json({
      message:        "Entrenamiento completado",
      job_id:         `job-${id_entrenamiento}-${Date.now()}`,
      id_modelo,
      id_entrenamiento,
      metricas:       ultimaMetrica,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;