// src/pages/Home.jsx

import React from 'react';

/**
 * @file Home.jsx
 * @description Startseite des Intranet-Kochbuchs "Topf Secret" mit Bild, Begrüßungstext,
 *              Icons zur Navigation (Rezepte / Login), Navbar und Footer. Layout exakt nach Skizze.
 */

export default function Home() {
  return (
    <>
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
  <div className="container">

    {/* Titelbild */}
    <div className="text-center mb-5">
      <img
        src="/images/Gruppe.png"
        alt="Startseitenbild"
        style={{
          maxWidth: '75%',
          height: 'auto',
          borderRadius: '8px',
        }}
      />
    </div>

    {/* Icons und Begrüßungstext nebeneinander mit mittiger Ausrichtung */}
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ gap: '4rem', flexWrap: 'nowrap' }}
    >
      {/* Icon: Rezepte (links vom Text) */}
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

      {/* Begrüßungstext (mittig) */}
      {/* Begrüßungstext (breiter & mehrspaltig) */}
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
  <h2 style={{ fontSize: '3rem', color: '#805437', marginBottom: '2rem' }}>
    Willkommen bei <strong>Topf Secret</strong>
  </h2>
  <p style={{ fontSize: '1.6rem', lineHeight: '1.9', color: '#805437', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
  Du hast ein Rezept kreiert, veredelt, gepimpt oder einfach auf Omas Dachboden gefunden – eins, das so amazing und awesome ist, 
  dass es der Welt nicht länger vorenthalten werden darf?
  <br /><br />
  Dann her damit! Auf <strong>Topf Secret</strong> kannst du deine Elite-Food-Stuff-Ideen teilen, zeigen, was du drauf hast 
  und dich von anderen inspirieren lassen.
  <br /><br />
   Klick einfach auf eins der Icons links oder rechts, um direkt loszulegen!
</p>


</div>

      {/* Icon: Login (rechts vom Text) */}
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



      {/* Footer */}
      <footer className="text-center py-3" style={{ backgroundColor: '#f7f3eb', borderTop: '1px solid #ccc' }}>
        <small style={{ color: '#805437' }}>
          &copy; 2025 Werksküche Berlin
        </small>
      </footer>
    </>
  );
}