/**
 * Authentifizierungsrouten für Login
 * @module routes/auth
 */

const express = require('express'); // Express-Modul importieren
const router = express.Router(); // Neuen Router erstellen
const bcrypt = require('bcrypt'); // Modul zum sicheren Passwortvergleich
const jwt = require('jsonwebtoken'); // Modul für Token-Erstellung
const db = require('../db'); // Unsere eigene Datenbankverbindung einbinden

/**
 * POST /login
 * Überprüft Login-Daten und gibt bei Erfolg ein JWT zurück
 * @name POST /login
 * @function
 * @param {import('express').Request} req - HTTP-Anfrage
 * @param {import('express').Response} res - HTTP-Antwort
 */
router.post('/login', async (req, res) => {
  try {
    // Die E-Mail und das Passwort aus dem Anfragekörper lesen
    const { email, password } = req.body;

    // Prüfen, ob beides angegeben wurde
    if (!email || !password) {
      // Wenn etwas fehlt, schicken wir eine Fehlermeldung zurück
      return res.status(400).json({ success: false, error: 'E-Mail und Passwort erforderlich' });
    }

    // Abfrage der Benutzerdaten aus der Datenbank mit der angegebenen E-Mail
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0]; // Wir erwarten genau einen Benutzer (oder keinen)

    // Wenn kein Benutzer mit dieser E-Mail existiert
    if (!user) {
      return res.status(401).json({ success: false, error: 'Benutzer nicht gefunden' });
    }

    // Prüfen, ob das eingegebene Passwort mit dem gespeicherten Hash übereinstimmt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Falls das Passwort falsch ist
      return res.status(401).json({ success: false, error: 'Falsches Passwort' });
    }

    // Wenn alles passt: Token erzeugen
    // Der Token enthält die User-ID und E-Mail, wird mit dem Wert aus .env signiert und ist 2h gültig
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Nutzerdaten im Token
      process.env.JWT_SECRET,                // Unser geheimer Schlüssel aus .env
      { expiresIn: '2h' }                    // Gültigkeit des Tokens
  );


    // Token erfolgreich erstellt → als Antwort an den Client schicken
    res.json({ success: true, token });

  } catch (err) {
    // Falls beim Ablauf etwas schiefgeht, hier die Fehlermeldung
    console.error('Fehler beim Login:', err);
    res.status(500).json({ success: false, error: 'Login fehlgeschlagen' });
  }
});

// Wir exportieren den Router, damit wir ihn in index.js einbinden können
module.exports = router;
