// src/pages/Home.jsx

import React from 'react';

/**
 * @file Home.jsx
 * @description Startseite mit Begrüßung und Beschreibung der Kochbuch-Plattform.
 *              Basierend auf dem Business-Casual-Template.
 */
export default function Home() {
  return (
    <section className="page-section clearfix">
      <div className="container">
        <div className="intro">
          <img
            className="img-fluid rounded mb-4"
            src="/images/Bild-Startseite.jpg"
            alt="Startseitenbild"
            style={{ maxWidth: '75%', height: 'auto', display: 'block', margin: '0 auto' }}
         />


          <div className="intro-text left-0 text-center bg-faded p-4 rounded" style={{ marginTop: '-20px' }}>
  <h2 className="text-center" style={{ fontSize: '2rem', color: '#805437' }}>
    Willkommen bei <strong>Topf&nbsp;Secret</strong>
  </h2>

  <p className="text-center mx-auto mt-3" style={{ maxWidth: '700px', color: '#805437' }}>
    Diese Plattform ist exklusiv für unsere Koch-Azubis und Mitarbeitenden gedacht –
    ein internes <em>Rezeptgeheimnis</em>, das wir miteinander teilen dürfen.
    Hier kannst du deine Lieblingsrezepte veröffentlichen, bearbeiten, kommentieren oder einfach stöbern.
    <br />
    <strong>Lust auf neue Ideen?</strong> Dann klick unten auf den Button und entdecke,
    was andere schon geteilt haben!
  </p>

  <div className="text-center mt-4">
    <a
      className="btn btn-xl"
      href="/recipes"
      style={{
        backgroundColor: '#f4a261',
        border: 'none',
        color: '#805437', // braun weich & freundlich
        fontWeight: 'bold',
      }}
    >
      Zu den Rezepten
    </a>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}
