import { Router } from "express";

import {

  getTutoriales,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,

} from "../controllers/tutorial.controller.js";

const router = Router();

router.get("/", getTutoriales);

router.get("/:id", getTutorial);

router.post("/", createTutorial);

router.put("/:id", updateTutorial);

router.delete("/:id", deleteTutorial);

export default router;