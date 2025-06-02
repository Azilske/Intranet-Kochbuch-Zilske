/**
 * @file Register.jsx
 * @description Seite zur Registrierung im Intranet-Kochbuch „Topf Secret“.
 *              Optisch identisch zur Login-Seite, mit Icons und stylischem Formular.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Für automatische Weiterleitung

export default function Register() {
  // State-Hooks für die Formularfelder
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Für Erfolg oder Fehlermeldung

  const navigate = useNavigate(); // Für spätere Weiterleitung

  // Formular absenden: POST-Request an das Backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert Neuladen der Seite

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, display_name: displayName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Erfolgreiche Registrierung: Anzeige + Felder zurücksetzen
        setMessage('Registrierung erfolgreich! Weiterleitung zum Login ...');
        setEmail('');
        setPassword('');
        setDisplayName('');

        // Nach 2 Sekunden zur Login-Seite weiterleiten
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Fehlermeldung vom Backend anzeigen
        setMessage(data.error || 'Fehler bei der Registrierung.');
      }
    } catch (error) {
      setMessage('Netzwerkfehler oder Server nicht erreichbar.');
    }
  };

  return (
    <>
      {/* Hauptinhalt der Seite */}
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
        <div className="container">

          {/* Icons links und rechts um das Formular herum */}
          <div className="d-flex justify-content-center align-items-start flex-wrap gap-5 mb-5">

            {/* Link: Icon zur Startseite */}
            <div className="text-center" style={{ flex: '1' }}>
              <a href="/">
                <img src="/images/icon-home.png" alt="Startseite" style={{ width: '400px', height: '400px', objectFit: 'contain' }} />
              </a>
              <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>Startseite</p>
            </div>

            {/* Mittig: Registrierungsformular */}
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
                Registrieren bei <strong>Topf Secret</strong>
              </h2>

              {/* Feedback-Meldung */}
              {message && (
                <div style={{ marginBottom: '1rem', color: message.includes('erfolgreich') ? 'green' : '#d9534f', fontWeight: 'bold' }}>
                  {message}
                </div>
              )}

              {/* Formularbereich */}
              <form onSubmit={handleSubmit}>
                {/* Eingabe: E-Mail-Adresse */}
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label htmlFor="email">E-Mail-Adresse</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%', padding: '1rem', fontSize: '1.6rem',
                      border: '1px solid #ccc', borderRadius: '5px', marginTop: '0.5rem'
                    }}
                    required
                  />
                </div>

                {/* Eingabe: Anzeigename */}
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label htmlFor="display_name">Anzeigename</label>
                  <input
                    type="text"
                    id="display_name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="z. B. KüchenQueen2025"
                    style={{
                      width: '100%', padding: '1rem', fontSize: '1.6rem',
                      border: '1px solid #ccc', borderRadius: '5px', marginTop: '0.5rem'
                    }}
                    required
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
                    style={{
                      width: '100%', padding: '1rem', fontSize: '1.6rem',
                      border: '1px solid #ccc', borderRadius: '5px', marginTop: '0.5rem'
                    }}
                    required
                  />
                </div>

                {/* Button zum Absenden */}
                <button
                  type="submit"
                  style={{
                    width: '100%', backgroundColor: '#f4a261', color: '#805437',
                    fontWeight: 'bold', padding: '1rem', fontSize: '1.6rem',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Jetzt registrieren
                </button>
              </form>

              {/* Hinweis für bestehende Nutzer:innen */}
              <p className="mt-3">
                Du hast schon einen Account?{' '}
                <a href="/login" style={{ color: '#805437' }}>
                  Zum Login
                </a>
              </p>
            </div>

            {/* Rechts: Icon zu den Rezepten */}
            <div className="text-center" style={{ flex: '1' }}>
              <a href="/recipes">
                <img src="/images/icon-rezepte.png" alt="Rezepte" style={{ width: '400px', height: '400px', objectFit: 'contain' }} />
              </a>
              <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>Rezepte</p>
            </div>
          </div>

          {/* Dekobild unter dem Formular */}
          <div className="text-center mt-5">
            <img
              src="/images/TopfSecretBerlin1.png"
              alt="Topf Secret Berlin Skyline"
              style={{ maxWidth: '1200px', height: 'auto', marginLeft: '-100px' }}
            />
          </div>
        </div>
      </main>

      {/* Footer mit Copyright */}
      <footer className="text-center py-3" style={{ backgroundColor: '#f7f3eb', borderTop: '1px solid #ccc' }}>
        <small style={{ color: '#805437' }}>
          &copy; 2025 Werksküche Berlin
        </small>
      </footer>
    </>
  );
}
