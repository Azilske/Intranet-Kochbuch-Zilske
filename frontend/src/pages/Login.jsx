/**
 * @file Login.jsx
 * @description Login-Seite mit fetch-Login und Weiterleitung zum Profil bei Erfolg.
 *              Zeigt Icons zur Navigation und behandelt Fehler elegant.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Für Navigation nach erfolgreichem Login

export default function Login() {
  // State für Benutzerangaben und Fehlermeldungen
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // React Router Hook für Weiterleitung

  /**
   * Senden der Login-Daten an das Backend.
   * Bei Erfolg: JWT speichern und zur Profilseite weiterleiten.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert Seitenreload

    try {
      // POST-Request an die /login-Route der API
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Login-Daten im Body
      });

      const data = await response.json();

      if (response.ok) {
        // Token im localStorage speichern
        localStorage.setItem('token', data.token);
        setError(''); // Fehler zurücksetzen
        navigate('/profile'); // Weiterleitung zur Profilseite
      } else {
        // Serverseitige Fehlermeldung anzeigen
        setError(data.message || 'Login fehlgeschlagen');
      }
    } catch (err) {
      // Netzwerk- oder Serverfehler
      setError('Serverfehler oder keine Verbindung.');
    }
  };

  return (
    <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
      <div className="container">

        {/* Layout mit drei Spalten (Icons links/rechts, Formular in der Mitte) */}
        <div className="d-flex justify-content-center align-items-start flex-wrap gap-5 mb-5">
          {/* Icon: Startseite (links) */}
          <div className="text-center" style={{ flex: '1' }}>
            <a href="/">
              <img
                src="/images/icon-home.png"
                alt="Startseite"
                style={{ width: '400px', height: '400px', objectFit: 'contain' }}
              />
            </a>
            <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>Startseite</p>
          </div>

          {/* Login-Formular (zentral) */}
          <div
            style={{
              maxWidth: '650px',
              flex: '2',
              textAlign: 'center',
              fontSize: '1.6rem',
              color: '#805437',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
              Anmelden bei <strong>Topf Secret</strong>
            </h2>

            {/* Fehlermeldung anzeigen (falls vorhanden) */}
            {error && (
              <div style={{ marginBottom: '1rem', color: 'red', fontWeight: 'bold' }}>
                {error}
              </div>
            )}

            {/* Login-Formular */}
            <form onSubmit={handleSubmit}>
              {/* Eingabe: E-Mail */}
              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label htmlFor="email">E-Mail-Adresse</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.6rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginTop: '0.5rem',
                  }}
                />
              </div>

              {/* Eingabe: Passwort */}
              <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <label htmlFor="password">Passwort</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="●●●●●●●"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.6rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginTop: '0.5rem',
                  }}
                />
              </div>

              {/* Absenden-Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#f4a261',
                  color: '#805437',
                  fontWeight: 'bold',
                  padding: '1rem',
                  fontSize: '1.6rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
            </form>

            {/* Hinweis: Link zur Registrierung */}
            <p className="mt-3">
              Noch kein Account?{' '}
              <a href="/register" style={{ color: '#805437' }}>
                Jetzt registrieren
              </a>
            </p>
          </div>

          {/* Icon: Rezepte (rechts) */}
          <div className="text-center" style={{ flex: '1' }}>
            <a href="/recipes">
              <img
                src="/images/icon-rezepte.png"
                alt="Rezepte"
                style={{ width: '400px', height: '400px', objectFit: 'contain' }}
              />
            </a>
            <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>Rezepte</p>
          </div>
        </div>

        {/* Dekobild unter dem Formular */}
        <div className="text-center mt-5">
          <img
            src="/images/TopfSecretBerlin1.png"
            alt="Topf Secret Berlin Skyline"
            style={{
              maxWidth: '1200px',
              height: 'auto',
              marginLeft: '-100px'
            }}
          />
        </div>
      </div>
    </main>
  );
}
