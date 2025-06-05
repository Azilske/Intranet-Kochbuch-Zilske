/**
 * @file NavBar.jsx
 * @description Navigationsleiste für die Anwendung „Topf Secret“.
 *              Zeigt dynamisch unterschiedliche Links je nach Login-Status an.
 *              Logout entfernt den Token und leitet zurück zum Login.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const navigate = useNavigate(); // Für Weiterleitungen (z. B. nach Logout)
  const location = useLocation(); // Zum Reagieren auf Seitenwechsel
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State für Loginstatus

  useEffect(() => {
    /**
     * Prüft, ob ein JWT-Token im localStorage vorhanden ist.
     * → Wenn ja, gilt der Benutzer als eingeloggt.
     */
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token); // true wenn Token vorhanden, sonst false
    };

    checkLogin(); // Direkt beim ersten Rendern prüfen

    // Bei Seitenwechsel erneut prüfen (hilfreich nach Login/Logout)
    // location.pathname triggert useEffect bei jedem URL-Wechsel
  }, [location.pathname]);

  /**
   * Logout-Handler:
   * – Entfernt den Token aus dem localStorage
   * – Setzt den Loginstatus zurück
   * – Leitet zur Login-Seite weiter
   */
  const handleLogout = () => {
    localStorage.removeItem('token'); // Token löschen
    setIsLoggedIn(false); // Status zurücksetzen
    navigate('/login'); // Weiterleitung zum Login
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#f7f3eb',
        borderBottom: '1px solid #ccc',
        color: '#805437',
        fontWeight: 'bold',
      }}
    >
      {/* Link zur Startseite */}
      <Link
        to="/"
        style={{ color: '#805437', textDecoration: 'none', fontSize: '1.6rem' }}
      >
         Topf Secret
      </Link>

      {/* Rechte Seite: Links je nach Loginstatus */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Rezepte-Link immer sichtbar */}
        <Link to="/recipes" style={{ color: '#805437', textDecoration: 'none' }}>
          Rezepte
        </Link>

        {isLoggedIn ? (
  <>
    {/* Link: Eigene Rezepte */}
    <Link to="/my-recipes" style={{ color: '#805437', textDecoration: 'none' }}>
      Meine Rezepte
    </Link>

      {/* Link: Neues Rezept hinzufügen */}
      <Link to="/new-recipe" style={{ color: '#805437', textDecoration: 'none' }}>
        Neues Rezept
      </Link>

        {/* Link: Profilseite */}
        <Link to="/profile" style={{ color: '#805437', textDecoration: 'none' }}>
          Mein Profil
        </Link>

        {/* Logout-Button */}
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#805437',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </>
) : (
  <>
    {/* Nur sichtbar, wenn nicht eingeloggt */}
    <Link to="/login" style={{ color: '#805437', textDecoration: 'none' }}>
      Login
    </Link>
    <Link to="/register" style={{ color: '#805437', textDecoration: 'none' }}>
      Registrieren
    </Link>
  </>
)}

      </div>
    </nav>
  );
}
