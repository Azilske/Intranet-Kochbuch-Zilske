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
 * @desc    Holt alle veröffentlichten Rezepte inkl. Anzeigename des Erstellers
 * @access  Öffentlich (kein Login nötig)
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.instructions, 
              recipe.image_url, recipe.published, recipe.user_id, user.display_name
       FROM recipe
       JOIN user ON recipe.user_id = user.id
       WHERE recipe.published = 1`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Rezepte:", error);
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
    const { title, ingredients, instructions, published } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        error: "Titel, Zutaten und Zubereitung sind erforderlich"
      });
    }
    const userId = req.user.id;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.query(
    `INSERT INTO recipe (user_id, title, ingredients, instructions, image_url, published)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, title, ingredients, instructions, image_url, published]
);

    res.status(201).json({
      success: true,
      message: "Rezept erfolgreich gespeichert und veröffentlicht",
      recipeId: result.insertId,
    });
  } catch (error) {
    console.error("Fehler beim Speichern des Rezepts:", error);
    res.status(500).json({ success: false, error: "Rezept konnte nicht gespeichert werden" });
  }
});

/**
 * @route   PUT /api/recipes/:id
 * @desc    Aktualisiert ein Rezept des eingeloggten Benutzers
 * @access  Privat (nur mit gültigem Token)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { title, ingredients, instructions, image_url, published } = req.body;
    const userId = req.user.id;
    const [checkRows] = await pool.query(
      "SELECT id FROM recipe WHERE id = ? AND user_id = ?",
      [recipeId, userId]
    );
    if (checkRows.length === 0) {
      return res.status(403).json({ success: false, error: "Kein Zugriff auf dieses Rezept" });
    }
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
    const recipeId = req.params.id;
    const userId = req.user.id;
    const [checkRows] = await pool.query(
      "SELECT id FROM recipe WHERE id = ? AND user_id = ?",
      [recipeId, userId]
    );
    if (checkRows.length === 0) {
      return res.status(403).json({ success: false, error: "Kein Zugriff – dieses Rezept gehört dir nicht" });
    }
    await pool.query("DELETE FROM recipe WHERE id = ?", [recipeId]);
    res.json({ success: true, message: "Rezept erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Rezepts:", error);
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
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT id, title, ingredients, instructions, image_url, published FROM recipe WHERE user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der eigenen Rezepte:", error);
    res.status(500).json({ error: "Rezepte konnten nicht geladen werden" });
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Holt ein einzelnes Rezept anhand der ID
 *          → Wenn veröffentlicht, ist kein Login nötig.
 *          → Wenn nicht veröffentlicht, nur für den Ersteller sichtbar.
 *          → Zusätzlich wird der display_name (Anzeigename) des Erstellers mitgeladen.
 * @access  Öffentlich oder privat (abhängig vom Rezeptstatus)
 */
router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;

  try {
    // Wenn ein Token vorhanden ist, verifiziere es und extrahiere die User-ID
    if (token) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    // Datenbankabfrage: Rezept inklusive Anzeigename (display_name) des Erstellers
    const [rows] = await pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.instructions, 
              recipe.image_url, recipe.published, recipe.user_id, user.display_name 
       FROM recipe
       JOIN user ON recipe.user_id = user.id
       WHERE recipe.id = ?`,
      [recipeId]
    );

    // Wenn kein Rezept gefunden wurde → 404
    if (rows.length === 0) {
      return res.status(404).json({ error: "Rezept nicht gefunden" });
    }

    const recipe = rows[0];

    // Wenn das Rezept nicht veröffentlicht ist → Zugriff nur für Besitzer:in
    if (!recipe.published && recipe.user_id !== userId) {
      return res.status(403).json({ error: "Kein Zugriff auf dieses Rezept" });
    }

    // Alles passt → Rezept zurückgeben (inkl. display_name)
    res.json(recipe);
  } catch (error) {
    console.error(" Fehler beim Abrufen des Rezepts:", error);
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
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Keine Bilddatei hochgeladen" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    if (req.file && !["image/jpeg", "image/png", "image/gif"].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Ungültiges Bildformat. Nur JPG, PNG und GIF sind erlaubt."
      });
    }

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

/**
 * @route   GET /api/recipes/:id/likes
 * @desc    Gibt die Like-Anzahl und ob der aktuelle User es geliket hat zurück
 * @access  Öffentlich (Token optional, aber für "likedByUser" nötig)
 */
router.get("/:id/likes", async (req, res) => {
  const recipeId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;

  try {
    // Token prüfen (optional)
    if (token) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    // Like-Zahl zählen
    const [[{ likeCount }]] = await pool.query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE recipe_id = ?",
      [recipeId]
    );

    // Prüfen, ob aktuelle:r Nutzer:in bereits geliket hat
    let likedByUser = false;
    if (userId) {
      const [liked] = await pool.query(
        "SELECT id FROM likes WHERE recipe_id = ? AND user_id = ?",
        [recipeId, userId]
      );
      likedByUser = liked.length > 0;
    }

    res.json({ likeCount, likedByUser });
  } catch (error) {
    console.error(" Fehler beim Laden der Likes:", error);
    res.status(500).json({ error: "Likes konnten nicht geladen werden" });
  }
});


/**
 * @route   POST /api/recipes/:id/like
 * @desc    Liked oder entliked ein Rezept (Toggle)
 * @access  Privat (nur eingeloggte Nutzer:innen)
 */
router.post("/:id/like", authMiddleware, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  try {
    // Prüfen, ob der Like bereits existiert
    const [existing] = await pool.query(
      "SELECT id FROM likes WHERE recipe_id = ? AND user_id = ?",
      [recipeId, userId]
    );

    if (existing.length > 0) {
      // Bereits geliket → Like entfernen
      await pool.query(
        "DELETE FROM likes WHERE recipe_id = ? AND user_id = ?",
        [recipeId, userId]
      );
      return res.json({ liked: false });
    } else {
      // Noch nicht geliket → Like setzen
      await pool.query(
        "INSERT INTO likes (recipe_id, user_id) VALUES (?, ?)",
        [recipeId, userId]
      );
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error(" Fehler beim Liken:", error);
    res.status(500).json({ error: "Like konnte nicht gesetzt werden" });
  }
});

/**
 * @route   GET /api/recipes/:id/comments
 * @desc    Holt alle Kommentare zu einem Rezept inklusive Nutzeranzeige
 * @access  Öffentlich (Login nicht erforderlich)
 */
router.get("/:id/comments", async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Holt alle Kommentare inkl. Nutzername (display_name) aus der Datenbank
    const [rows] = await pool.query(
      `SELECT comments.id, comments.text, comments.created_at, user.display_name 
       FROM comments 
       JOIN user ON comments.user_id = user.id 
       WHERE comments.recipe_id = ? 
       ORDER BY comments.created_at ASC`,
      [recipeId]
    );

    // Gibt die vollständigen Kommentarobjekte aus (inkl. display_name)

    // Antwort an Client senden
    res.json(rows);
  } catch (error) {
    console.error(" Fehler beim Laden der Kommentare:", error);
    res.status(500).json({
      error: "Kommentare konnten nicht geladen werden",
      details: error.message,
    });
  }
});



/**
 * @route   POST /api/recipes/:id/comments
 * @desc    Fügt einen neuen Kommentar zum Rezept hinzu und gibt ihn direkt mit display_name zurück
 * @access  Privat (nur eingeloggte Nutzer:innen)
 */
router.post("/:id/comments", authMiddleware, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;
  const { text } = req.body;

  // Validierung: Kein leerer Kommentar erlaubt
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Kommentar darf nicht leer sein" });
  }

  try {
    // Kommentar speichern
    const [insertResult] = await pool.query(
      `INSERT INTO comments (recipe_id, user_id, text) 
       VALUES (?, ?, ?)`,
      [recipeId, userId, text.trim()]
    );

    // display_name des aktuellen Users abfragen (für Sofortanzeige im Frontend)
    const [userRow] = await pool.query(
      `SELECT display_name FROM user WHERE id = ?`,
      [userId]
    );

    res.status(201).json({
      success: true,
      message: "Kommentar gespeichert",
      commentId: insertResult.insertId,
      display_name: userRow[0]?.display_name || "Unbekannt",
    });
  } catch (error) {
    console.error(" Fehler beim Speichern des Kommentars:", error);
    res.status(500).json({
      error: "Kommentar konnte nicht gespeichert werden",
      details: error.message,
    });
  }
});


module.exports = router;
