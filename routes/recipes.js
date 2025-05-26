// Importiert das Express-Framework
const express = require("express");

// Erstellt einen neuen Router – damit können wir Routen auslagern
const router = express.Router();

// Importiert die Datenbankverbindung aus db.js (mit Verbindungspool)
const pool = require("../db");

// Importiert die Middleware für geschützte Routen (JWT-Überprüfung)
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/recipes
 * @desc    Holt alle veröffentlichten Rezepte aus der Datenbank
 * @access  Öffentlich (kein Login nötig)
 */
router.get("/", async (req, res) => {
  try {
    // Führt eine SQL-Abfrage aus: alle Rezepte, bei denen 'published' = 1 (also veröffentlicht) ist
    const [rows] = await pool.query(
      "SELECT id, title, ingredients, instructions, image_url FROM recipe WHERE published = 1"
    );

    // Antwort an den Client: JSON-Liste der gefundenen Rezepte
    res.json(rows);
  } catch (error) {
    // Wenn ein Fehler passiert (z. B. DB-Verbindungsproblem), wird der Fehler geloggt...
    console.error("Fehler beim Abrufen der Rezepte:", error);

    // ...und dem Client ein Fehlercode mit Text zurückgegeben
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
    // Rezeptdaten aus dem Body lesen
    const { title, ingredients, instructions, image_url } = req.body;

    // Validierung: Alle Pflichtfelder müssen da sein
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        error: "Titel, Zutaten und Zubereitung sind erforderlich"
      });
    }

    // Die user_id holen wir aus dem geprüften JWT (via authMiddleware)
    const userId = req.user.userId; // <--- HIER korrigiert: vorher war es req.user.id

    // Rezept in die Datenbank einfügen
    const [result] = await pool.query(
      `INSERT INTO recipe (user_id, title, ingredients, instructions, image_url, published)
       VALUES (?, ?, ?, ?, ?, 0)`, // published = 0 = Entwurf
      [userId, title, ingredients, instructions, image_url || null]
    );

    // Erfolgreiche Antwort mit ID des neuen Rezepts
    res.status(201).json({
      success: true,
      message: "Rezept erfolgreich gespeichert (noch nicht veröffentlicht)",
      recipeId: result.insertId
    });
  } catch (error) {
    console.error("Fehler beim Speichern des Rezepts:", error);
    res.status(500).json({ success: false, error: "Rezept konnte nicht gespeichert werden" });
  }
});

// Exportiert den Router, damit er in index.js eingebunden werden kann
module.exports = router;
