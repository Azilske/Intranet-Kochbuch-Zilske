/**
 * @file Home.jsx
 * @description Startseite des Intranet-Kochbuchs "Topf Secret" mit Bild, Begrüßungstext,
 *              Titelüberschrift, Icons zur Navigation (Rezepte / Login) und globalem Footer.
 */

import React from 'react';
import Footer from '../components/Footer'; // Globaler Footer, wird ganz unten eingeblendet

export default function Home() {
  return (
    <>
      {/* Hauptbereich der Startseite */}
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
        <div className="container text-center">

          {/* Überschrift: Titel und Slogan */}
          <h1 style={{ color: '#805437', fontSize: '5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Topf Secret
          </h1>
          <h4 style={{ color: '#805437', fontSize: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
            Deine Skills. Dein Geschmack!
          </h4>

          {/* Titelbild */}
          <div className="text-center mb-5">
            <img
              src="/images/Gruppe.png"
              alt="Startseitenbild"
              style={{
                maxWidth: '75%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Iconbereich + Begrüßungstext nebeneinander */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ gap: '4rem', flexWrap: 'nowrap' }}
          >
            {/* Link zur Rezeptseite */}
            <div className="text-center">
              <a href="/recipes">
                <img
                  src="/images/icon-rezepte.png"
                  alt="Rezepte"
                  style={{ width: '320px', height: '320px', objectFit: 'contain' }}
                />
              </a>
              <p style={{ fontWeight: 'bold', color: '#805437' }}>Rezepte</p>
            </div>

            {/* Begrüßungstext in der Mitte */}
            <div
              style={{
                maxWidth: '1000px',
                textAlign: 'center',
                margin: '0 auto',
                padding: '1rem 2rem',
                lineHeight: '1.8',
                fontSize: '1.6rem',
                color: '#805437'
              }}
            >
              <p style={{
                fontSize: '1.6rem',
                lineHeight: '1.9',
                maxWidth: '900px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                Du hast ein Rezept kreiert, veredelt, gepimpt oder einfach auf Omas Dachboden gefunden – eins, das so amazing und awesome ist, 
                dass es der Welt nicht länger vorenthalten werden darf?
                <br /><br />
                Dann her damit! Auf <strong>Topf Secret</strong> kannst du deine Elite-Food-Stuff-Ideen teilen, zeigen, was du drauf hast 
                und dich von anderen inspirieren lassen.
                <br /><br />
                Klick einfach auf eins der Icons links oder rechts, um direkt loszulegen!
              </p>
            </div>

            {/* Link zur Login-Seite */}
            <div className="text-center">
              <a href="/login">
                <img
                  src="/images/icon-login.png"
                  alt="Login"
                  style={{ width: '320px', height: '320px', objectFit: 'contain' }}
                />
              </a>
              <p style={{ fontWeight: 'bold', color: '#805437' }}>Registrierung / Login</p>
            </div>
          </div>
        </div>
      </main>

      
    </>
  );
}
