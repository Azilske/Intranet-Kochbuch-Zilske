/**
 * Hauptmodul für den Express-Server
 * @module index
 */

require('dotenv').config(); // lädt die .env-Datei

// Importiert die Routen für Rezepte (z. B. GET /api/recipes, GET /api/recipes/:id, usw.)
const recipeRoutes = require("./routes/recipes");

// Importiert das Express-Framework zur Erstellung eines Webservers
const express = require('express');

// Importiert den MariaDB-Datenbankpool aus der neuen config/db.js
const db = require('./config/db');

// Importiert bcrypt, um Passwörter sicher zu hashen (z. B. bei Registrierung)
const bcrypt = require('bcrypt');

// Importiert die selbst geschriebene Middleware zur JWT-Überprüfung
const authMiddleware = require('./middleware/authMiddleware');

// Importiert die Routen für Login und Registrierung aus routes/login.js
const authRoutes = require('./routes/login');

// Erstellt eine neue Express-Anwendung (App-Objekt)
const app = express();

// Definiert den Port, auf dem der Server später erreichbar ist
const PORT = 3000;

// Middleware: Wandelt JSON-Body automatisch in ein JavaScript-Objekt um
app.use(express.json());


/**
 * Root-Route (GET /)
 * Sendet eine einfache Willkommensnachricht als Antwort.
 * Diese Route ist nützlich als Schnelltest, ob der Server läuft.
 * @name GET /
 * @function
 * @param {import('express').Request} req - HTTP Request Objekt
 * @param {import('express').Response} res - HTTP Response Objekt
 */
app.get('/', (req, res) => {
  // Sendet einen einfachen Text als Antwort zurück
  res.send('Hallo Angela, dein Express-Server läuft!');
});

/**
 * Test-Route für die Datenbankverbindung
 * Führt eine einfache SQL-Anfrage aus, um zu prüfen, ob die Verbindung zur Datenbank funktioniert.
 * Gibt die aktuelle Zeit vom Datenbankserver zurück.
 * @name GET /db-test
 * @function
 * @param {import('express').Request} req - HTTP-Anfrageobjekt
 * @param {import('express').Response} res - HTTP-Antwortobjekt
 */
app.get('/db-test', async (req, res) => {
  try {
    // Führt eine SQL-Abfrage aus, um die aktuelle Zeit vom Server abzurufen
    const [rows] = await db.query('SELECT NOW() AS time');

    // Gibt die Zeit im JSON-Format an den Client zurück
    res.json({ success: true, serverTime: rows[0].time });
  } catch (error) {
    // Gibt den Fehler in der Konsole aus
    console.error('Fehler bei DB-Verbindung:', error);

    // Gibt dem Client eine Fehlermeldung zurück
    res.status(500).json({ success: false, error: 'Verbindung fehlgeschlagen' });
  }
});

/**
 * Route zur Registrierung eines neuen Benutzers
 * Erwartet E-Mail, Passwort und Anzeigename, hasht das Passwort und speichert alles in der DB
 * @name POST /register
 * @function
 * @param {import('express').Request} req - HTTP-Anfrageobjekt
 * @param {import('express').Response} res - HTTP-Antwortobjekt
 */
app.post('/register', async (req, res) => {
  try {
    // Daten aus dem Request-Body extrahieren
    const { email, password, display_name } = req.body;

    // Überprüfung, ob alle Felder ausgefüllt sind
    if (!email || !password || !display_name) {
      // Antwort mit Fehler, wenn Felder fehlen
      return res.status(400).json({ success: false, error: 'Alle Felder sind erforderlich' });
    }

    // Passwort mit bcrypt verschlüsseln (10 Salt-Runden)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in die Datenbank einfügen
    const [result] = await db.query(
      'INSERT INTO user (email, password, display_name) VALUES (?, ?, ?)',
      [email, hashedPassword, display_name]
    );

    // Erfolgreiche Antwort zurückgeben
    res.status(201).json({
      success: true,
      message: 'Benutzer registriert',
      userId: result.insertId // Gibt die neue Benutzer-ID zurück
    });
  } catch (error) {
    // Fehlerbehandlung, z. B. bei doppelter E-Mail
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ success: false, error: 'Registrierung fehlgeschlagen' });
  }
});

// Authentifizierungsrouten einbinden (z. B. /login)
app.use('/', authRoutes); // Macht alle Routen aus routes/auth.js unter der Basis-URL nutzbar

/**
 * Einbindung der Rezepte-Routen
 * Leitet alle Anfragen, die mit /api/recipes beginnen, an routes/recipes.js weiter.
 * Dort sind z. B. GET /api/recipes oder GET /api/recipes/:id definiert.
 */
app.use("/api/recipes", recipeRoutes);



/**
 * Geschützte Test-Route (nur mit gültigem Token zugänglich)
 * Wird nur ausgeführt, wenn ein gültiger Token im Header mitgeschickt wird
 * @name GET /api/protected
 * @function
 * @middleware authMiddleware
 */
app.get('/api/protected',

  // Zuerst wird die Token-Middleware aufgerufen
  authMiddleware,

  // Dann wird die Antwort nur ausgeführt, wenn der Token gültig ist
  (req, res) => {
    res.json({
      success: true,
      message: `Hallo ${req.user.email}, du hast Zugriff auf geschützte Daten!`
    });
  }
);

/**
 * Startet den Express-Server
 * Sobald der Server läuft, wird eine Info in der Konsole ausgegeben
 */
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
