import { Router } from "express";
import {
  createDataset,
  getDatasets,
  deleteDataset,
} from "../controllers/dataset.controller.js";

import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, createDataset);
router.get("/", verifyToken, getDatasets);
router.delete("/:id", verifyToken, deleteDataset);

export default router;