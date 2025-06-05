/**
 * @file routes/userRecipes.js
 * @description Route zum Abrufen aller eigenen Rezepte für eingeloggte Benutzer.
 */

const express = require("express");
const router = express.Router();

// Middleware zur Token-Überprüfung (JWT)
const authMiddleware = require("../middleware/authMiddleware");

// MariaDB-Datenbank-Pool importieren (keine Funktion, sondern Pool-Objekt)
const pool = require("../config/db");

/**
 * @route   GET /api/user-recipes
 * @desc    Gibt alle Rezepte des aktuell eingeloggten Nutzers zurück.
 * @access  Privat (nur mit gültigem Token)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Führt die SQL-Abfrage aus
    const [rows] = await pool.execute(
      "SELECT id, title, ingredients, instructions, image_url, published FROM recipe WHERE user_id = ?",
      [req.user.id]
  );


    // Gibt die Rezepte als JSON-Antwort zurück
    res.json(rows);
  } catch (error) {
    console.error("Fehler beim Abrufen eigener Rezepte:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Exportiert den Router für die Nutzung in index.js
module.exports = router;
