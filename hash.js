/**
 * Hilfsskript zum Erzeugen eines bcrypt-Hashes für ein Passwort
 * 
 * Wird genutzt, um ein Passwort manuell für die Datenbank zu verschlüsseln,
 * z. B. wenn man einen Benutzer ohne Frontend-Formular anlegen möchte.
 * 
 * Ausführen mit: node hash.js
 */

const bcrypt = require('bcrypt'); // bcrypt-Modul laden – wird für Passwort-Hashing verwendet

// Das zu verschlüsselnde Passwort
const password = 'Sicher123!';

// Die Anzahl der sogenannten „Salt-Runden“
// Je höher, desto sicherer, aber auch langsamer (10 ist Standard)
const saltRounds = 10;

// Passwort-Hash erzeugen
bcrypt.hash(password, saltRounds, (err, hash) => {
  // Falls beim Hashen ein Fehler auftritt
  if (err) {
    console.error('Fehler beim Hashen:', err);
    return;
  }

  // Wenn erfolgreich, gib den Hash im Terminal aus
  console.log('Gehashtes Passwort:', hash);
});
