// Importiert das Express-Framework für die Routenbehandlung
const express = require('express');

// Erstellt einen neuen Router für die Login-Funktionalität
const router = express.Router();

// Importiert bcrypt zum sicheren Vergleichen von Passwörtern
const bcrypt = require('bcrypt');

// Importiert jsonwebtoken zum Erstellen von JWT-Tokens
const jwt = require('jsonwebtoken');

// Importiert die Datenbankverbindung aus config/db.js
const db = require('../config/db');

/**
 * @route   POST /login
 * @desc    Überprüft die Login-Daten des Nutzers und gibt bei Erfolg ein JWT zurück
 * @access  Öffentlich
 */
router.post('/login', async (req, res) => {
  try {
    // Holt E-Mail und Passwort aus dem Request-Body
    const { email, password } = req.body;

    // Prüft, ob beide Felder übergeben wurden
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'E-Mail und Passwort erforderlich'
      });
    }

    // Holt den passenden Benutzer aus der Datenbank anhand der E-Mail
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0]; // Erwartet genau einen Benutzer oder undefined

    // Wenn kein Benutzer zur E-Mail existiert, gib Fehler zurück
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Benutzer nicht gefunden'
      });
    }

    // Vergleicht das übergebene Passwort mit dem gehashten Passwort aus der DB
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Wenn das Passwort nicht passt, gib Fehlermeldung zurück
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Falsches Passwort'
      });
    }

    // Wenn Passwort korrekt ist, wird ein JWT erzeugt
    const token = jwt.sign(
      {
        userId: user.id,        // ID des Benutzers im Token speichern
        email: user.email       // Auch die E-Mail zur Info im Token
      },
      process.env.JWT_SECRET,   // Geheimer Schlüssel aus .env-Datei
      { expiresIn: '24h' }      // Token ist 24 Stunden gültig
    );

    // Gibt das Token als Antwort an den Client zurück
    res.json({
      success: true,
      token
    });

  } catch (err) {
    // Loggt den Fehler in der Konsole (für Debugging)
    console.error('Fehler beim Login:', err);

    // Gibt eine allgemeine Fehlermeldung an den Client zurück
    res.status(500).json({
      success: false,
      error: 'Login fehlgeschlagen'
    });
  }
});

// Exportiert den Router, damit er in index.js eingebunden werden kann
module.exports = router;
