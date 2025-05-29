import React from 'react';

/**
 * @file Template.jsx
 * @description Bootstrap-Vorlage „Business Casual“ als Layout-Komponente für die App.
 *
 * Diese Komponente zeigt das Design (Header, Footer usw.) und bettet den Seiteninhalt (children) ein.
 */
function Template({ children }) 
 {
  return (
    <>
      <header>
        <h1 className="site-heading text-center text-faded d-none d-lg-block">
          <span className="site-heading-upper text-primary mb-3">Intranet-Kochbuch</span>
          <span className="site-heading-lower">Azubi-Rezepte</span>
        </h1>
      </header>

      <nav className="navbar navbar-expand-lg navbar-dark py-lg-4" id="mainNav">
        <div className="container">
          <a className="navbar-brand text-uppercase fw-bold d-lg-none" href="#">Kochbuch</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item px-lg-4"><a className="nav-link text-uppercase" href="/">Start</a></li>
              <li className="nav-item px-lg-4"><a className="nav-link text-uppercase" href="#">Über</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        {children}
      </main>

      <footer className="footer text-faded text-center py-5">
        <div className="container">
          <p className="m-0 small">© Intranet-Kochbuch 2025</p>
        </div>
      </footer>
    </>
  );
}
export default Template;
