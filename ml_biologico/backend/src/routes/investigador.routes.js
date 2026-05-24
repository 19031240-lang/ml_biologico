import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/stats", async (req, res) => {

  try {

    // DATOS FALSOS TEMPORALES
    const data = [

      {
        Epoca: 1,
        Loss_Train: 0.9,
        Loss_Val: 0.8,
        Accuracy: 0.60,
        Precision: 0.58,
        Recall: 0.55,
        F1_Score: 0.56,
      },

      {
        Epoca: 2,
        Loss_Train: 0.7,
        Loss_Val: 0.6,
        Accuracy: 0.70,
        Precision: 0.68,
        Recall: 0.66,
        F1_Score: 0.67,
      },

      {
        Epoca: 3,
        Loss_Train: 0.5,
        Loss_Val: 0.4,
        Accuracy: 0.82,
        Precision: 0.80,
        Recall: 0.78,
        F1_Score: 0.79,
      },

      {
        Epoca: 4,
        Loss_Train: 0.3,
        Loss_Val: 0.2,
        Accuracy: 0.91,
        Precision: 0.90,
        Recall: 0.89,
        F1_Score: 0.89,
      },

    ];

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

});

export default router;