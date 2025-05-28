// Wir importieren Link von react-router-dom, um später "Details ansehen"-Links zu bauen
import { Link } from 'react-router-dom';

// Die Hauptkomponente für die Rezeptliste
const RecipeList = () => {
  // Beispiel-Daten – jetzt mit lokalen Bildern aus dem public/images/ Ordner
  const recipes = [
    {
      id: 1,
      title: 'Pasta Carbonara',
      image_url: '/images/pasta.jpg', // ← Lokales Bild aus public/images/
    },
    {
      id: 2,
      title: 'Frischer Salat',
      image_url: '/images/salat.jpg', // ← Lokales Bild aus public/images/
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Rezepte</h2>

      {/* Bootstrap-Grid für die Cards */}
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>
            <div className="card h-100 shadow">
              <img
                src={recipe.image_url}
                className="card-img-top"
                alt={recipe.title}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{recipe.title}</h5>
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="btn btn-primary mt-auto"
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

// Wir exportieren die Komponente, damit sie in App.jsx verwendet werden kann
export default RecipeList;
