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
            className="intro-img img-fluid mb-3 mb-lg-0 rounded"
            src="/assets/img/intro.jpg"
            alt="Startseitenbild"
          />
          <div className="intro-text left-0 text-center bg-faded p-5 rounded">
            <h2 className="section-heading mb-4">
              <span className="section-heading-upper">Willkommen</span>
              <span className="section-heading-lower">im Intranet-Kochbuch</span>
            </h2>
            <p className="mb-3">
              Diese Plattform ist für unsere Koch-Azubis und Mitarbeitenden gedacht, um eigene Rezepte zu erstellen,
              auszutauschen und gemeinsam Neues zu entdecken.
            </p>
            <div className="intro-button mx-auto">
              <a className="btn btn-primary btn-xl" href="/recipes">
                Zu den Rezepten
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
