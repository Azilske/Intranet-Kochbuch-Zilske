/**
 * Hauptmodul für den Express-Server
 * @module index
 */

// Importiert das Express-Framework zur Erstellung eines Webservers
const express = require('express');

// Importiert den selbst erstellten MariaDB-Datenbankpool aus db.js
const db = require('./db');

// Erstellt eine neue Express-Anwendung
const app = express();

// Definiert den Port, auf dem der Server Anfragen akzeptieren soll
const PORT = 3000;

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

const bcrypt = require('bcrypt'); // Für Passwort-Hashing

/**
 * Route zur Registrierung eines neuen Benutzers
 * Nimmt E-Mail, Passwort und Anzeigename entgegen, hasht das Passwort und speichert alles in der DB.
 * @name POST /register
 * @function
 * @param {import('express').Request} req - HTTP-Anfrageobjekt
 * @param {import('express').Response} res - HTTP-Antwortobjekt
 */
app.use(express.json()); // Middleware, um JSON-Daten im Body zu parsen

app.post('/register', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    // Einfache Validierung
    if (!email || !password || !display_name) {
      return res.status(400).json({ success: false, error: 'Alle Felder sind erforderlich' });
    }

    // Passwort mit bcrypt hashen (10 Runden Salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in die Datenbank einfügen
    const [result] = await db.query(
      'INSERT INTO user (email, password, display_name) VALUES (?, ?, ?)',
      [email, hashedPassword, display_name]
    );

    // Erfolgreiche Antwort zurückgeben
    res.status(201).json({ success: true, message: 'Benutzer registriert', userId: result.insertId });
  } catch (error) {
    // Fehlerbehandlung, z. B. bei doppelter E-Mail
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ success: false, error: 'Registrierung fehlgeschlagen' });
  }
});

const authRoutes = require('./routes/auth'); // Authentifizierungsrouten importieren
app.use('/', authRoutes); // Routen unter der Basis-URL / verfügbar machen

/**
 * Startet den Express-Server
 * Sobald der Server läuft, wird eine Info in der Konsole ausgegeben
 */
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
