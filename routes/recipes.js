// Importiert das Express-Framework
const express = require("express");

// Erstellt einen neuen Router
const router = express.Router();

// Holt die Datenbankverbindung aus config/db.js
const pool = require("../config/db");

// Importiert die Middleware zum Überprüfen von JWTs
const authMiddleware = require("../middleware/authMiddleware");

// Importiert das Multer-Modul für Datei-Uploads
const multer = require("multer");
const path = require("path");

// Definiert das Speicherziel und den Dateinamen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Zielverzeichnis für Uploads
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    // Nutzt Datum + Originalname, um doppelte zu vermeiden
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Filter: Nur Bilder zulassen (jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Nur Bildformate erlaubt (jpg, png, gif)"), false);
  }
};

// Multer-Middleware konfigurieren
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max. 5MB
});

/**
 * @route   GET /api/recipes
 * @desc    Holt alle veröffentlichten Rezepte aus der Datenbank
 * @access  Öffentlich (kein Login nötig)
 */
router.get("/", async (req, res) => {
  try {
    // Fragt alle Rezepte ab, bei denen "published" = 1 ist
    const [rows] = await pool.query(
      "SELECT id, title, ingredients, instructions, image_url FROM recipe WHERE published = 1"
    );

    // Sendet die gefundenen Rezepte als JSON an den Client
    res.json(rows);
  } catch (error) {
    // Loggt den Fehler in der Konsole
    console.error("Fehler beim Abrufen der Rezepte:", error);

    // Sendet einen Fehlerstatus und eine Nachricht zurück
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

/**
 * @route   POST /api/recipes
 * @desc    Erstellt ein neues Rezept inkl. Bild (optional)
 * @access  Privat (nur mit gültigem Token)
 */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // Holt die Rezeptdaten aus dem Formular
    const { title, ingredients, instructions } = req.body;

    // Prüft, ob die Pflichtfelder gesetzt sind
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        error: "Titel, Zutaten und Zubereitung sind erforderlich"
      });
    }

    // Holt die User-ID aus dem Token (gesetzt durch authMiddleware)
    const userId = req.user.userId;

    // Falls ein Bild hochgeladen wurde, generiere URL
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Rezept in die Datenbank einfügen
    const [result] = await pool.query(
      `INSERT INTO recipe (user_id, title, ingredients, instructions, image_url, published)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [userId, title, ingredients, instructions, image_url]
    );

    // Antwort mit Erfolg und neuer Rezept-ID
    res.status(201).json({
      success: true,
      message: "Rezept erfolgreich gespeichert (noch nicht veröffentlicht)",
      recipeId: result.insertId,
    });
  } catch (error) {
    console.error("Fehler beim Speichern des Rezepts:", error);
    res.status(500).json({
      success: false,
      error: "Rezept konnte nicht gespeichert werden"
    });
  }
});

   /**
 * @route   PUT /api/recipes/:id
 * @desc    Aktualisiert ein Rezept des eingeloggten Benutzers
 * @access  Privat (nur mit gültigem Token)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Holt die Rezept-ID aus der URL (z. B. /api/recipes/4)
    const recipeId = req.params.id;

    // Holt die Daten aus dem Body (können geändert werden)
    const { title, ingredients, instructions, image_url, published } = req.body;

    // Holt die Benutzer-ID aus dem JWT
    const userId = req.user.userId;

    // Prüft, ob das Rezept überhaupt diesem Nutzer gehört
    const [checkRows] = await pool.query(
      "SELECT id FROM recipe WHERE id = ? AND user_id = ?",
      [recipeId, userId]
    );

    if (checkRows.length === 0) {
      return res.status(403).json({ success: false, error: "Kein Zugriff auf dieses Rezept" });
    }

    // Führt das Update durch (nur erlaubte Felder)
    await pool.query(
      `UPDATE recipe 
       SET title = ?, ingredients = ?, instructions = ?, image_url = ?, published = ?
       WHERE id = ?`,
      [title, ingredients, instructions, image_url || null, published || 0, recipeId]
    );

    res.json({ success: true, message: "Rezept wurde aktualisiert" });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Rezepts:", error);
    res.status(500).json({ success: false, error: "Rezept konnte nicht bearbeitet werden" });
  }
});

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Löscht ein Rezept des eingeloggten Benutzers
 * @access  Privat (nur mit gültigem Token)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Holt die Rezept-ID aus der URL (z. B. /api/recipes/7)
    const recipeId = req.params.id;

    // Holt die Benutzer-ID aus dem JWT (gesetzt durch authMiddleware)
    const userId = req.user.userId;

    // Prüft, ob das Rezept überhaupt diesem Nutzer gehört
    const [checkRows] = await pool.query(
      "SELECT id FROM recipe WHERE id = ? AND user_id = ?",
      [recipeId, userId]
    );

    // Wenn kein entsprechendes Rezept gefunden wurde → kein Zugriff
    if (checkRows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "Kein Zugriff – dieses Rezept gehört dir nicht"
      });
    }

    // Führt die Löschung durch
    await pool.query("DELETE FROM recipe WHERE id = ?", [recipeId]);

    // Erfolgreiche Antwort
    res.json({ success: true, message: "Rezept erfolgreich gelöscht" });
  } catch (error) {
    // Fehlerausgabe in der Konsole
    console.error("Fehler beim Löschen des Rezepts:", error);

    // Antwort mit Fehler
    res.status(500).json({ success: false, error: "Rezept konnte nicht gelöscht werden" });
  }
});

/**
 * @route   GET /api/myrecipes
 * @desc    Holt alle Rezepte der eingeloggten Nutzerin
 * @access  Privat (nur mit gültigem Token)
 */
router.get("/myrecipes", authMiddleware, async (req, res) => {
  try {
    // Liest die userId aus dem Token
    const userId = req.user.userId;

    // Fragt alle Rezepte ab, die zur eingeloggten Benutzerin gehören
    const [rows] = await pool.query(
      "SELECT id, title, ingredients, instructions, image_url, published FROM recipe WHERE user_id = ?",
      [userId]
    );

    // Gibt die Liste der eigenen Rezepte zurück
    res.json(rows);
  } catch (error) {
    // Fehlerausgabe in der Konsole
    console.error("Fehler beim Abrufen der eigenen Rezepte:", error);

    // Fehlerantwort an den Client
    res.status(500).json({ error: "Rezepte konnten nicht geladen werden" });
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Holt ein einzelnes veröffentlichtes Rezept anhand der ID
 * @access  Öffentlich (nur wenn published = 1)
 */
router.get("/:id", async (req, res) => {
  // Die ID des Rezepts aus der URL auslesen
  const recipeId = req.params.id;

  try {
    // Nur ein Rezept mit genau dieser ID und published = 1 auswählen
    const [rows] = await pool.query(
      "SELECT id, title, ingredients, instructions, image_url FROM recipe WHERE id = ? AND published = 1",
      [recipeId]
    );

    // Wenn kein veröffentlichtes Rezept mit dieser ID gefunden wurde
    if (rows.length === 0) {
      return res.status(404).json({ error: "Rezept nicht gefunden oder nicht veröffentlicht" });
    }

    // Erfolgreiche Rückgabe des Rezepts im JSON-Format
    res.json(rows[0]);
  } catch (error) {
    // Fehler beim Abrufen des Rezepts
    console.error("Fehler beim Abrufen des Rezepts:", error);
    res.status(500).json({ error: "Serverfehler beim Abrufen des Rezepts" });
  }
});

/**
 * @route   POST /api/recipes/upload-image
 * @desc    Lädt ein Rezeptbild hoch und gibt die URL zurück
 * @access  Privat (nur mit gültigem Token)
 */
router.post("/upload-image", authMiddleware, upload.single("image"), (req, res) => {
  try {
    // Wenn keine Datei/Bild enthalten ist
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Keine Bilddatei hochgeladen" });
    }

    // URL zur gespeicherten Datei erstellen
    const imageUrl = `/uploads/${req.file.filename}`;

    // (Optional) Format des hochgeladenen Bildes zusätzlich prüfen
    if (req.file && !["image/jpeg", "image/png", "image/gif"].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Ungültiges Bildformat. Nur JPG, PNG und GIF sind erlaubt."
      });
    }

    // Erfolgsmeldung mit Bild-URL
    res.status(201).json({
      success: true,
      message: "Bild erfolgreich hochgeladen",
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Fehler beim Upload:", error);
    res.status(500).json({ success: false, error: "Fehler beim Hochladen des Bildes" });
  }
});

// Exportiert den Router, damit er in index.js verwendet werden kann
module.exports = router;
