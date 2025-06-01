import React from 'react';

/**
 * @file Login.jsx
 * @description Seite zur Anmeldung im Intranet-Kochbuch „Topf Secret“.
 *              Mit Icons zur Navigation und stylischem Formular im Zentrum.
 */

export default function Login() {
  return (
    <>
      {/* Hauptbereich */}
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
        <div className="container">

          {/* Icons links und rechts */}
          <div
            className="d-flex justify-content-center align-items-start flex-wrap gap-5 mb-5"
          >
            {/* Icon – Startseite */}
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

            {/* Login-Formular in der Mitte */}
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

              {/* Formular */}
              <form>
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label htmlFor="email">E-Mail-Adresse</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
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

                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                  <label htmlFor="password">Passwort</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="●●●●●●●"
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

                {/* Button */}
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

              {/* Hinweis zur Registrierung */}
              <p className="mt-3">
                Noch kein Account? <a href="#" style={{ color: '#805437' }}>Jetzt registrieren</a>
              </p>
            </div>

            {/* Icon – Rezepte */}
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

          {/* Bild unter dem Loginbereich */}
          <div className="text-center mt-5">
            <img
  src="/images/TopfSecretBerlin1.png"
  alt="Topf Secret Berlin Skyline"
  style={{
    maxWidth: '1200px',
    height: 'auto',
    marginLeft: '-100px'  // <<< Bild leicht nach links schieben
  }}
/>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3" style={{ backgroundColor: '#f7f3eb', borderTop: '1px solid #ccc' }}>
        <small style={{ color: '#805437' }}>
          &copy; 2025 Werksküche Berlin
        </small>
      </footer>
    </>
  );
}
