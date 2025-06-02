/**
 * @file App.jsx
 * @description Hauptkomponente der React-Anwendung für das Intranet-Kochbuch.
 *              Initialisiert den Router, rendert die Seiten und zeigt Navigation + Footer.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Globale Navigationsleiste und Footer (werden auf allen Seiten angezeigt)
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Seitenkomponenten
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Rezept-Komponenten (Übersicht + Detailansicht)
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';

/**
 * Hauptkomponente der Anwendung.
 * Definiert Routing-Logik mit React Router und bindet NavBar + Footer global ein.
 *
 * @returns {JSX.Element} Die gerenderte App-Komponente.
 */
function App() {
  return (
    <Router>
      {/* Navigationsleiste oben – auf allen Seiten sichtbar */}
      <NavBar />

      {/* Seiteninhalt je nach Route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Footer unten – auf allen Seiten sichtbar */}
      <Footer />
    </Router>
  );
}

export default App;
