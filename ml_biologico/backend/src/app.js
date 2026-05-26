import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes         from "./routes/auth.routes.js";
import userRoutes         from "./routes/users.routes.js";
import datasetRoutes      from "./routes/dataset.routes.js";
import imageRoutes        from "./routes/image.routes.js";
import statsRoutes        from "./routes/stats.routes.js";
import investigadorRoutes from "./routes/investigador.routes.js";
import tutorialRoutes     from "./routes/tutorial.routes.js";
import estudianteRoutes  from "./routes/estudiante.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",         authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/datasets",     datasetRoutes);
app.use("/api/images",       imageRoutes);
app.use("/api/stats",        statsRoutes);
app.use("/api/investigador", investigadorRoutes);
app.use("/api/models",       investigadorRoutes);
app.use("/api/tutoriales",   tutorialRoutes);
app.use("/api/estudiante",   estudianteRoutes);  

app.get("/", (req, res) => res.send("API funcionando"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));