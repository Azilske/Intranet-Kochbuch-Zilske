/**
 * @file App.jsx
 * @description Hauptkomponente der React-Anwendung für das Intranet-Kochbuch.
 *              Initialisiert den Router, rendert die Seiten und zeigt die Navigation.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';           // Komponenten für Rezeptübersicht
import RecipeDetail from './components/RecipeDetail';       // Komponenten für Detailansicht
import Home from './pages/Home';                            // Startseite
import Login from './pages/Login';                          // Login-Seite
import Register from './pages/register';                    // Registrierungsseite für neue Benutzer:innen

/**
 * Hauptkomponente der Anwendung.
 * Stellt Navigation und Routing bereit.
 *
 * @returns {JSX.Element} Die gerenderte App-Komponente.
 */
function App() {
  return (
    <Router>
      {/* Navigationsleiste ganz oben – rechtsbündig */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: '#f7f3eb',       // Farblich ans Design angepasst
          borderBottom: '1px solid #ccc',   // Dezente Trennlinie
          padding: '0.5rem 1rem',           // Innenabstand
        }}
      >
        <div className="d-flex justify-content-end w-100 px-4">
          {/* Navigationlinks */}
          <a
            className="nav-link me-3"
            href="/"
            style={{ color: '#805437', fontSize: '2rem', fontWeight: '500' }}
          >
            Startseite
          </a>
          <a
            className="nav-link me-3"
            href="/recipes"
            style={{ color: '#805437', fontSize: '2rem', fontWeight: '500' }}
          >
            Rezepte
          </a>
          <a
            className="nav-link"
            href="/login"
            style={{ color: '#805437', fontSize: '2rem', fontWeight: '500' }}
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hauptcontainer für die Inhalte der jeweiligen Seite */}
      <div className="container mt-4">

        {/* Überschrift – optional, kann entfallen wenn Home-Seite eigenen Titel zeigt */}
        <h1 className="text-center mb-1" style={{ fontSize: '5rem', color: '#805437' }}>
          Topf Secret
          <div style={{ fontSize: '3rem', color: '#805437', marginTop: '0.3rem' }}>
            Deine Skills. Dein Geschmack!
          </div>
        </h1>

        {/* Routing für die verschiedenen Seiten */}
        <Routes>
          <Route path="/" element={<Home />} />                       {/* Startseite */}
          <Route path="/recipes" element={<RecipeList />} />          {/* Rezeptübersicht */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />    {/* Einzelrezept */}
          <Route path="/login" element={<Login />} />                 {/* Login / Registrierung */}
          <Route path="/register" element={<register />} />           {/* Registrierungsformular für neue Nutzer:innen */}
        </Routes>
      </div>
    </Router>
  );
}

// Exportiert die Hauptkomponente zur Verwendung im Haupt-Entry (main.jsx)
export default App;
