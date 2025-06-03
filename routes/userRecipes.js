/**
 * @file routes/userRecipes.js
 * @description Route zum Abrufen aller eigenen Rezepte für eingeloggte Benutzer.
 */

const express = require("express");
const router = express.Router();

// Importiert die Middleware zur Token-Überprüfung (JWT)
const authMiddleware = require("../middleware/authMiddleware");

// Importiert die DB-Verbindung
const getDatabaseConnection = require("../config/db");

/**
 * @route   GET /api/user-recipes
 * @desc    Gibt alle Rezepte des aktuell eingeloggten Nutzers zurück.
 * @access  Privat (nur mit gültigem Token)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Holt eine Datenbankverbindung
    const connection = await getDatabaseConnection();

    // Führt die Abfrage aus: alle Rezepte, die diesem Nutzer gehören
    const [rows] = await connection.execute(
      "SELECT id, title, ingredients, instructions, image_url, is_published, created_at FROM recipe WHERE user_id = ?",
      [req.user.id]
    );

    // Gibt die Verbindung zurück in den Pool
    connection.release();

    // Sendet die Daten an das Frontend zurück
    res.json(rows);
  } catch (error) {
    console.error("Fehler beim Abrufen eigener Rezepte:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Exportiert den Router
module.exports = router;
