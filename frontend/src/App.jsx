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
import Home from './pages/Home';            // Startseite
import Login from './pages/Login';          // Login-Seite
import Register from './pages/Register';    // Registrierung
import Profile from './pages/Profile';      // Mein Profil
import MyRecipes from './pages/MyRecipes';  // Eigene Rezepte
import AddRecipe from './pages/AddRecipe';  // Neues Rezept erstellen

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
        {/* Route für die Startseite – zeigt die Home-Komponente */}
        <Route path="/" element={<Home />} />

        {/* Route für die Übersicht aller veröffentlichten Rezepte */}
        <Route path="/recipes" element={<RecipeList />} />

        {/* Route für die Detailansicht eines Rezepts (z. B. /recipes/5) */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />

        {/* Route für die Login-Seite */}
        <Route path="/login" element={<Login />} />

        {/* Route für die Registrierungsseite */}
        <Route path="/register" element={<Register />} />

        {/* Route für die Profilseite (nach dem Login sichtbar) */}
        <Route path="/profile" element={<Profile />} />

        {/* Route für die eigene Rezeptübersicht (nur meine Rezepte) */}
        <Route path="/myrecipes" element={<MyRecipes />} />

        {/* Route zur Seite, auf der ich ein neues Rezept erstellen kann */}
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>

      {/* Footer unten – auf allen Seiten sichtbar */}
      <Footer />
    </Router>
  );
}

export default App;
