/**
 * @file RecipeList.jsx
 * @description Zeigt eine Liste an Beispielrezepten im Card-Layout mit lokalen Bildern.
 *              Jede Karte enthält ein Bild, einen Titel und einen Link zur Detailansicht.
 */

import { Link } from 'react-router-dom'; // Für die Navigation zu Detailseiten

/**
 * Komponente für die Rezeptliste.
 *
 * @returns {JSX.Element} Grid mit Rezeptkarten
 */
const RecipeList = () => {
  // Platzhalter-Daten – später durch API-Daten ersetzen
  const recipes = [
    {
      id: 1,
      title: 'Pasta Carbonara',
      image_url: '/images/pasta.jpg', // ← Bild muss in public/images/ liegen
    },
    {
      id: 2,
      title: 'Frischer Salat',
      image_url: '/images/salat.jpg',
    },
  ];

  return (
    <div className="container mt-4">
      {/* Überschrift */}
      <h2 className="mb-4" style={{ color: '#805437' }}>
        Rezepte
      </h2>

      {/* Grid-Layout für Rezeptkarten */}
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>
            <div className="card h-100 shadow">
              {/* Rezeptbild */}
              <img
                src={recipe.image_url}
                className="card-img-top"
                alt={recipe.title}
                style={{ objectFit: 'cover', height: '250px' }}
              />

              {/* Inhalt der Card */}
              <div className="card-body d-flex flex-column">
                {/* Titel */}
                <h5 className="card-title" style={{ color: '#805437' }}>
                  {recipe.title}
                </h5>

                {/* Link zur Detailansicht */}
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
