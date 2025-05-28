// Importiert die nötigen Komponenten aus React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importiert die React-Komponente für die Rezeptliste
import RecipeList from './components/RecipeList';

// Importiert die React-Komponente für die Detailansicht eines Rezepts
import RecipeDetail from './components/RecipeDetail';

// Hauptkomponente der Anwendung
function App() {
  return (
    // Router umgibt die gesamte App und ermöglicht Navigation
    <Router>
      <Routes>
        {/* Route für die Startseite – zeigt alle veröffentlichten Rezepte */}
        <Route path="/" element={<RecipeList />} />

        {/* Route für die Detailansicht eines einzelnen Rezepts anhand seiner ID */}
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

// Exportiert die App-Komponente für die Verwendung in main.jsx
export default App;
