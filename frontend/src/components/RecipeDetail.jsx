import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  // useParams holt die ID aus der URL – z. B. /recipes/42 → id = 42
  const { id } = useParams();

  // Hier speichern wir das Rezept, sobald es geladen ist
  const [recipe, setRecipe] = useState(null);

  // useEffect wird beim ersten Laden der Komponente ausgeführt
  useEffect(() => {
    // Hole das Rezept von der API
    fetch(`http://dwg.mshome.net:3000/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Fehler beim Laden des Rezepts');
        return res.json();
      })
      .then((data) => {
        setRecipe(data); // Rezept ins State speichern
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [id]); // Nur neu laden, wenn sich die ID ändert

  // Solange noch kein Rezept da ist → Ladeanzeige
  if (!recipe) return <p>Lade Rezept...</p>;

  // Rezept anzeigen
  return (
    <div>
      <h2>{recipe.title}</h2>
      <h4>Zutaten:</h4>
      <p>{recipe.ingredients}</p>
      <h4>Zubereitung:</h4>
      <p>{recipe.instructions}</p>
      {/* Falls du später Bilder hast */}
      {recipe.image_url && (
        <img src={recipe.image_url} alt="Rezeptbild" style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
};

export default RecipeDetail;
