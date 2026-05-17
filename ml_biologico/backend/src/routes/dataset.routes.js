import { Router } from "express";

import {
  createDataset,
  deleteDataset,
} from "../controllers/dataset.controller.js";

import { verifyToken } from "../middleware/auth.js";

import { pool } from "../config/db.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  createDataset
);

// GET DATASETS
router.get(
  "/",
  verifyToken,

  async (req, res) => {

    try {
const [rows] = await pool.query(`
  SELECT
    d.*,

    (
      SELECT url
      FROM imagenes
      WHERE id_dataset = d.id_dataset
      LIMIT 1
    ) imagen

  FROM datasets d
`);

      res.json(rows);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });

    }

  }
);

router.delete(
  "/:id",
  verifyToken,
  deleteDataset
);

export default router;