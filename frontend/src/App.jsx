/**
 * @file App.jsx
 * @description Hauptkomponente der React-Anwendung für das Intranet-Kochbuch.
 *              Enthält die Routing-Logik und bindet Bootstrap-Klassen für Layout und Design ein.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Home from './pages/Home';

/**
 * Hauptkomponente der Anwendung.
 * Stellt das Layout bereit, initialisiert den Router und rendert die passenden Unterseiten.
 *
 * @returns {JSX.Element} Die gerenderte App-Komponente mit Bootstrap-Layout und Routing.
 */
function App() {
  return (
    // Bootstrap-Container für zentriertes, responsives Layout
<div className="container mt-4">
  {/* Hauptüberschrift mit individueller Farbgestaltung – Titel in Schwarz & Grau, Untertitel in Grau */}
  <h1 className="text-center mb-4" style={{ color: '#805437' }}>
  Topf&nbsp;Secret
  <small className="d-block" style={{ fontSize: '1rem', color: '#a97458' }}>
    die Ausbildungsküche
  </small>
</h1>




      {/* BrowserRouter steuert die Navigation über Pfade */}
      <Router>
        <Routes>
          {/* Route für die Startseite – zeigt Begrüßung und Einstieg */}
          <Route path="/" element={<Home />} />

          {/* Route für die Rezeptübersicht – zeigt alle veröffentlichten Rezepte */}
          <Route path="/recipes" element={<RecipeList />} />

          {/* Route für die Detailansicht eines Rezepts anhand seiner ID */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

// Exportiert die Hauptkomponente zur Verwendung in main.jsx
export default App;
