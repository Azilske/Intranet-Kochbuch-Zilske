/**
 * @file routes/profile.js
 * @description Routen zur Profildaten-Verwaltung und zum Upload von Profilbildern
 */

const express = require('express');
const router = express.Router();
const multer = require('multer'); // Zum Verarbeiten von Datei-Uploads
const db = require('../config/db'); // DB-Verbindung
const authMiddleware = require('../middleware/authMiddleware'); // Tokenprüfung
const bcrypt = require('bcrypt'); // Zum Hashen von Passwörtern
const path = require('path');

// Multer-Konfiguration: Speicherort und Dateiname
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Zielordner
  },
  filename: function (req, file, cb) {
    // Dateiname: timestamp-originalname
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

// Multer-Middleware aktivieren (für 1 Datei mit Namen "profileImage")
const upload = multer({ storage: storage });

/**
 * GET /api/profile
 * Holt E-Mail und Anzeigename anhand der ID aus dem JWT-Token
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT email, display_name, image FROM user WHERE id = ?',
      [req.user.id]
    );

    // ...
    res.json({
      success: true,
      email: rows[0].email,
      displayName: rows[0].display_name,
      image: rows[0].image,
    });
  } catch (err) {
    // ...
  }
});

/**
 * PUT /api/profile
 * Speichert E-Mail, Anzeigename und (optional) neues Passwort
 */
router.put('/', authMiddleware, async (req, res) => {
  const { email, displayName, password } = req.body;

  try {
    if (!email || !displayName) {
      return res.status(400).json({ success: false, error: 'Felder dürfen nicht leer sein' });
    }

    // Wenn Passwort mitgeschickt wird → neu hashen
    if (password && password.length > 0) {
      const hashed = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE user SET email = ?, display_name = ?, password = ? WHERE id = ?',
        [email, displayName, hashed, req.user.id]
      );
    } else {
      await db.query('UPDATE user SET email = ?, display_name = ? WHERE id = ?', [
        email,
        displayName,
        req.user.id,
      ]);
    }

    res.json({ success: true, message: 'Profil aktualisiert' });
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).json({ success: false, error: 'Serverfehler beim Speichern' });
  }
});

/**
 * POST /api/profile/upload
 * Nimmt das hochgeladene Bild entgegen und speichert es im Upload-Ordner
 */
router.post('/upload', authMiddleware, upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
  }


  // Optional: Bildpfad in der Datenbank speichern (nicht Pflicht)
  res.json({
    success: true,
    message: 'Bild erfolgreich hochgeladen',
    imagePath: `/uploads/${req.file.filename}`,
  });
});
/**
 * PUT /api/profile/profile-picture
 * Speichert das hochgeladene Bild im Upload-Ordner
 * und trägt den Pfad in der Datenbank ein (user.image)
 */
router.put('/profile-picture', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Kein Bild hochgeladen' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    // Bildpfad in die Datenbank schreiben
    const [result] = await db.query(
      'UPDATE user SET image = ? WHERE id = ?',
      [imagePath, req.user.id]
    );

    if (result.affectedRows === 0) {
      console.error('❌ Benutzer nicht gefunden oder nicht aktualisiert');
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }

    res.json({
      success: true,
      message: 'Profilbild aktualisiert',
      imagePath,
    });
  } catch (err) {
    console.error('❌ Fehler beim Speichern des Profilbilds:', err);
    res.status(500).json({ success: false, error: 'Serverfehler beim Speichern' });
  }
});



module.exports = router;
