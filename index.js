/**
 * Hauptmodul für den Express-Server
 * @module index
 */

require('dotenv').config(); // Lädt Umgebungsvariablen aus der .env-Datei

// Importiert das CORS-Modul, um Cross-Origin-Anfragen vom Frontend zu erlauben
const cors = require('cors');

// Importiert das Express-Framework zur Erstellung eines Webservers
const express = require('express');

// Importiert das path-Modul, um Dateipfade zu verarbeiten (z. B. für statische Ordner)
const path = require('path'); // ← NEU: Wird für den Upload-Ordner benötigt

// Importiert die Routen für Rezepte (z. B. GET /api/recipes, GET /api/recipes/:id, usw.)
const recipeRoutes = require("./routes/recipes");

// Importiert den MariaDB-Datenbankpool aus config/db.js
const db = require('./config/db');

// Importiert bcrypt, um Passwörter sicher zu hashen (z. B. bei Registrierung)
const bcrypt = require('bcrypt');

// Importiert die Middleware zur JWT-Überprüfung (Token-Check)
const authMiddleware = require('./middleware/authMiddleware');

// Importiert die Routen für Login und Registrierung
const authRoutes = require('./routes/login');

// Erstellt eine neue Express-Anwendung
const app = express();

// Importiert die Routen für Profile – z. B. Bild-Upload und Benutzerprofil aktualisieren
const profileRoutes = require('./routes/profile'); 

// Importiert die Routen für die eigenen Rezepte
const userRecipesRoutes = require('./routes/userRecipes');


// Aktiviert CORS für das React-Frontend (Port 5173 über dwg.mshome.net)
app.use(cors({
  origin: 'http://dwg.mshome.net:5173', // ← Erlaubt nur mein Vite-Frontend
  credentials: true                     // ← Lässt auch Cookies oder Tokens durch (für spätere Authentifizierung)
}));

// Middleware: Wandelt JSON-Body automatisch in ein JavaScript-Objekt um
app.use(express.json());

/**
 * Stellt den Ordner 'uploads/' unter der URL '/uploads' öffentlich zur Verfügung,
 * sodass z. B. Profilbilder über http://dwg.mshome.net:3000/uploads/dateiname.jpg
 * abrufbar sind.
 */
// Macht den Ordner "uploads" öffentlich zugänglich – z. B. für Rezeptbilder unter http://dwg.mshome.net:3000/uploads/dateiname.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 

// Aktiviert die Routen unter /api/user-recipes
app.use("/api/user-recipes", userRecipesRoutes);

// Definiert den Port, auf dem der Server später erreichbar ist
const PORT = 3000;

/**
 * Root-Route (GET /)
 * Sendet eine einfache Willkommensnachricht als Antwort.
 * Diese Route ist nützlich als Schnelltest, ob der Server läuft.
 */
app.get('/', (req, res) => {
  res.send('Hallo Angela, dein Express-Server läuft!');
});

/**
 * Test-Route für die Datenbankverbindung
 * Führt eine SQL-Abfrage aus, um die aktuelle Zeit vom Datenbankserver zu bekommen
 */
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS time');
    res.json({ success: true, serverTime: rows[0].time });
  } catch (error) {
    console.error('Fehler bei DB-Verbindung:', error);
    res.status(500).json({ success: false, error: 'Verbindung fehlgeschlagen' });
  }
});

/**
 * Route zur Registrierung eines neuen Benutzers
 * Erwartet: email, password, display_name
 */
app.post('/register', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    // Prüfung: alle Felder vorhanden?
    if (!email || !password || !display_name) {
      return res.status(400).json({ success: false, error: 'Alle Felder sind erforderlich' });
    }

    // Passwort hashen mit bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Eintrag in Datenbank
    const [result] = await db.query(
      'INSERT INTO user (email, password, display_name) VALUES (?, ?, ?)',
      [email, hashedPassword, display_name]
    );

    res.status(201).json({
      success: true,
      message: 'Benutzer registriert',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ success: false, error: 'Registrierung fehlgeschlagen' });
  }
});

// Authentifizierungsrouten aktivieren (z. B. POST /login)
app.use('/', authRoutes);

/**
 * Rezepte-Routen aktivieren – Weiterleitung zu routes/recipes.js
 */
app.use("/api/recipes", recipeRoutes);

// Aktiviert die Profilrouten – z. B. für GET /api/profile oder POST /api/profile/upload
app.use('/api/profile', profileRoutes);

/**
 * Beispiel für geschützte Route (nur mit gültigem Token erreichbar)
 * Der Token wird durch authMiddleware geprüft
 */
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Hallo ${req.user.email}, du hast Zugriff auf geschützte Daten!`
  });
});

/**
 * Startet den Express-Server und macht ihn im gesamten Netzwerk erreichbar,
 * z. B. unter http://dwg.mshome.net:3000 vom Frontend aus.
 * Wichtig: '0.0.0.0' erlaubt Verbindungen von außen (nicht nur localhost).
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf http://dwg.mshome.net:${PORT}`);
});
