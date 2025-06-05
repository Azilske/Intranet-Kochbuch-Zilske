/**
 * Middleware zum Überprüfen eines gültigen JSON Web Tokens (JWT)
 * Nur Nutzer mit gültigem Token dürfen auf geschützte Routen zugreifen
 */

const jwt = require('jsonwebtoken'); // JSON Web Token-Bibliothek importieren

/**
 * Middleware-Funktion zum Schutz von Routen
 * @param {import('express').Request} req - Die eingehende HTTP-Anfrage
 * @param {import('express').Response} res - Die HTTP-Antwort
 * @param {import('express').NextFunction} next - Weitergabe an die nächste Middleware
 */
function authMiddleware(req, res, next) {
  // Den Token aus dem Authorization-Header auslesen
  const authHeader = req.headers['authorization'];

  // Der Header sieht normalerweise so aus: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  // Wenn kein Token vorhanden ist → Zugriff verweigern
  if (!token) {
    return res.status(401).json({ success: false, message: 'Kein Token übermittelt' });
  }

  try {
    // Token mit dem geheimen Schlüssel überprüfen
    const secret = process.env.JWT_SECRET || 'geheim123'; // fallback nur für dev/test
    const decoded = jwt.verify(token, secret);

    // Den Benutzer aus dem Token speichern, damit seine ID später verwendet werden kann
    req.user = { id: decoded.id };

    // Weiter zur nächsten Middleware oder Route
    next();
  } catch (err) {
    // Wenn der Token ungültig oder abgelaufen ist
    return res.status(403).json({ success: false, message: 'Token ungültig oder abgelaufen' });
  }
}

module.exports = authMiddleware;
