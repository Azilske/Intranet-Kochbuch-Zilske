/**
 * @file Register.jsx
 * @description Registrierungsseite für das Intranet-Kochbuch „Topf Secret“.
 *              Beinhaltet ein Formular zur Neuanmeldung mit E-Mail und Passwort.
 */

import React from 'react';

export default function Register() {
  return (
    <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
      <div className="container text-center" style={{ maxWidth: '600px', margin: '0 auto', color: '#805437' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>
          Registrieren bei <strong>Topf Secret</strong>
        </h2>

        <form>
          {/* E-Mail */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ fontSize: '1.6rem', fontWeight: '500' }}>
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '1.2rem',
                fontSize: '1.6rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '0.5rem'
              }}
            />
          </div>

          {/* Passwort */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ fontSize: '1.6rem', fontWeight: '500' }}>
              Passwort
            </label>
            <input
              type="password"
              id="password"
              placeholder="●●●●●●●"
              style={{
                width: '100%',
                padding: '1.2rem',
                fontSize: '1.6rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginTop: '0.5rem'
              }}
            />
          </div>

          {/* Registrieren-Button */}
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
              cursor: 'pointer'
            }}
          >
            Jetzt registrieren
          </button>
        </form>

        <p className="mt-3">
          Du hast schon einen Account? <a href="/login" style={{ color: '#805437' }}>Zum Login</a>
        </p>
      </div>
    </main>
  );
}
