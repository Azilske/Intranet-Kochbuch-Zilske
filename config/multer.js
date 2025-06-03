/**
 * @file config/multer.js
 * @description Konfiguriert Multer für Datei-Uploads (z. B. Rezeptbilder, Profilbilder).
 */

const multer = require("multer");
const path = require("path");

// Zielverzeichnis für hochgeladene Dateien
const uploadDirectory = path.join(__dirname, "..", "uploads");

// Legt fest, wie und wo Dateien gespeichert werden
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Speicherort: /uploads
  },
  filename: (req, file, cb) => {
    // Erzeugt einen eindeutigen Dateinamen (z. B. 1717435789-avatar.jpg)
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filter: Erlaubt nur Bilder (jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Datei akzeptiert
  } else {
    cb(new Error("Nur Bilddateien sind erlaubt"), false);
  }
};

// Exportiert eine upload()-Funktion für einzelne Bilder
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max. 5 MB
});

module.exports = upload;
