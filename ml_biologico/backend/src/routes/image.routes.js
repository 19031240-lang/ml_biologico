import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", verifyToken, upload.single("imagen"), uploadImage);

export default router;