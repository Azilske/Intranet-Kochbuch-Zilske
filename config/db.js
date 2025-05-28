/**
 * Modul zur Herstellung einer Verbindung mit der MariaDB-Datenbank
 * @module db
 */

const mysql = require('mysql2/promise'); // Importiert das MySQL2-Modul mit Promise-Unterstützung

/**
 * Erstellt einen Verbindungs-Pool für die MariaDB-Datenbank
 * @constant
 */
const pool = mysql.createPool({
  host: 'localhost',          // Hostname des Datenbankservers
  user: 'azilske',            // MariaDB-Benutzername
  password: 'j0hnny22',       // Passwort des Benutzers
  database: 'fi37_zilske_fpadw', // Name der Datenbank
  waitForConnections: true,   // Wartet auf freie Verbindungen, statt Fehler zu werfen
  connectionLimit: 10,        // Maximale Anzahl gleichzeitiger Verbindungen
  queueLimit: 0               // Unbegrenzte Warteschlange für Anfragen
});

/**
 * Exportiert den Verbindungs-Pool für andere Module
 */
module.exports = pool;
