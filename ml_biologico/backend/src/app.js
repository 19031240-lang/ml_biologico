import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import datasetRoutes from "./routes/dataset.routes.js";
import imageRoutes from "./routes/image.routes.js";


dotenv.config();
console.log("JWT:", process.env.JWT_SECRET);
const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/images", imageRoutes);


app.get("/", (req, res) => {
  res.send("API funcionando");
});
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor en puerto", PORT);
});