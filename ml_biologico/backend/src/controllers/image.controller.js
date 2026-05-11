import { pool } from "../config/db.js";

export const uploadImage = async (req, res) => {
  try {
    const { id_dataset } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No se subió archivo",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO imagenes (url, id_dataset) VALUES (?, ?)",
      [file.filename, id_dataset]
    );

    res.json({
      message: "Imagen subida",
      archivo: file.filename,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};