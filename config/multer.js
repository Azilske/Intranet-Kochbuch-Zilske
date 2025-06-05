/**
 * @file config/multer.js
 * @description Konfiguriert Multer für sichere Bild-Uploads (z. B. Profilbilder, Rezeptbilder).
 * Unterstützt JPEG, PNG und GIF bis max. 5 MB. Speichert alle Dateien im Ordner /uploads.
 */

const multer = require("multer");
const path = require("path");

// Zielverzeichnis für hochgeladene Dateien: /uploads relativ zum Projektverzeichnis
const uploadDirectory = path.join(__dirname, "..", "uploads");

// Konfiguration des Multer-Speichers
const storage = multer.diskStorage({
  // Legt fest, wo die Datei gespeichert wird
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  // Legt den Dateinamen fest (z. B. 1717435789-avatar.png)
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeFilename = file.originalname.replace(/\s+/g, "-").toLowerCase(); // Leerzeichen entfernen
    const uniqueName = `${timestamp}-${safeFilename}`;
    cb(null, uniqueName);
  },
});

// Filterfunktion: Nur bestimmte Bildtypen zulassen
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Datei akzeptiert
  } else {
    cb(new Error("Nur JPEG, PNG oder GIF-Bilder sind erlaubt."), false);
  }
};

// Multer-Konfiguration mit Dateigrößenlimit und Filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maximal 5 MB
});

module.exports = upload;
