// Importiert das Express-Framework
const express = require("express");

// Erstellt einen neuen Router
const router = express.Router();

// Holt die Datenbankverbindung aus config/db.js
const pool = require("../config/db");

// Importiert die Middleware zum Überprüfen von JWTs
const authMiddleware = require("../middleware/authMiddleware");

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
 * @desc    Erstellt ein neues Rezept für den eingeloggten Benutzer
 * @access  Privat (nur mit gültigem Token)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Holt die Rezeptdaten aus dem Request-Body
    const { title, ingredients, instructions, image_url } = req.body;

    // Prüft, ob alle Pflichtfelder vorhanden sind
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        error: "Titel, Zutaten und Zubereitung sind erforderlich"
      });
    }

    // Liest die Benutzer-ID aus dem JWT (gesetzt von authMiddleware)
    const userId = req.user.userId;

    // Führt das INSERT-Statement aus (published = 0 = Entwurf)
    const [result] = await pool.query(
      `INSERT INTO recipe (user_id, title, ingredients, instructions, image_url, published)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [userId, title, ingredients, instructions, image_url || null]
    );

    // Sendet eine Erfolgsmeldung mit der neuen Rezept-ID
    res.status(201).json({
      success: true,
      message: "Rezept erfolgreich gespeichert (noch nicht veröffentlicht)",
      recipeId: result.insertId
    });
  } catch (error) {
    // Loggt den Fehler
    console.error("Fehler beim Speichern des Rezepts:", error);

    // Antwort mit Fehlerstatus und Nachricht
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

// Exportiert den Router, damit er in index.js verwendet werden kann
module.exports = router;
