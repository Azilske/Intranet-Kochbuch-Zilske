/**
 * @file RecipeList.jsx
 * @description Diese Komponente zeigt eine Liste echter Rezepte aus dem Backend im Card-Layout.
 *              Jedes Rezept enthält ein Bild, einen Titel und einen Link zur Detailansicht.
 *              Das Layout ist an das Design der anderen Seiten angepasst (ohne Icons/Deko).
 */

import { useEffect, useState } from 'react'; // React-Hooks für Zustand und Lifecycle
import { Link } from 'react-router-dom'; // Für die Navigation zur Detailseite

/**
 * RecipeList-Komponente – lädt und zeigt alle Rezepte vom Server.
 *
 * @returns {JSX.Element} Die Seite mit einem Grid aus Rezeptkarten.
 */
const RecipeList = () => {
  // Zustand für die geladenen Rezepte
  const [recipes, setRecipes] = useState([]);

  // Rezepte beim Laden der Komponente vom Server abrufen
  useEffect(() => {
    // Fetch-Aufruf an das eigene Backend, um alle veröffentlichten Rezepte zu holen
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes`)
      .then((res) => {
        if (!res.ok) {
          // Wenn die Antwort fehlschlägt, Fehler werfen
          throw new Error('Fehler beim Laden der Rezepte');
        }
        return res.json(); // Antwort als JSON parsen
      })
      .then((data) => {
        // Daten in den Zustand übernehmen
        setRecipes(data);
      })
      .catch((error) => {
        // Fehlerbehandlung (z. B. wenn der Server nicht erreichbar ist)
        console.error('Fehler beim Laden der Rezepte:', error.message);
      });
  }, []); // useEffect nur einmal beim ersten Render ausführen

  return (
    <div className="container mt-4">
      {/* Überschrift der Seite */}
      <h2 className="mb-4" style={{ color: '#805437' }}>
        Rezepte
      </h2>

      {/* Grid-Layout für alle Rezeptkarten */}
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>
            <div className="card h-100 shadow">
              {/* Rezeptbild (wird über die image_url vom Server geliefert) */}
              <img
                src={recipe.image_url}
                className="card-img-top"
                alt={recipe.title}
                style={{ objectFit: 'cover', height: '250px' }}
              />

              {/* Inhalt der Rezeptkarte */}
              <div className="card-body d-flex flex-column">
                {/* Titel des Rezepts */}
                <h5 className="card-title" style={{ color: '#805437' }}>
                  {recipe.title}
                </h5>

                {/* Link zur Detailseite für dieses Rezept */}
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="btn btn-warning mt-auto"
                  style={{
                    backgroundColor: '#f4a261',
                    border: 'none',
                    color: '#805437',
                    fontWeight: 'bold',
                  }}
                >
                  Details ansehen
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
