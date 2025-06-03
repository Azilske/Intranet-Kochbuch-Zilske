/**
 * @file RecipeDetail.jsx
 * @description Detailansicht für ein einzelnes Rezept im Intranet-Kochbuch.
 *              Holt das Rezept per ID aus dem Backend und zeigt Titel, Zutaten, Zubereitung und Bild.
 */

import { useEffect, useState } from 'react'; // React-Hooks
import { useParams } from 'react-router-dom'; // Für Zugriff auf die ID aus der URL

/**
 * RecipeDetail-Komponente – zeigt die Detailansicht eines einzelnen Rezepts.
 *
 * @returns {JSX.Element} Die vollständige Anzeige des Rezepts mit Bild, Zutaten und Zubereitung.
 */
const RecipeDetail = () => {
  // Holt die Rezept-ID aus der URL – z. B. /recipes/42 → id = "42"
  const { id } = useParams();

  // Zustand für das aktuell geladene Rezept
  const [recipe, setRecipe] = useState(null);

  // Beim ersten Laden (oder wenn sich die ID ändert) das Rezept vom Server holen
  useEffect(() => {
    // API-Aufruf: Holt das Rezept mit der übergebenen ID vom eigenen Server
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) {
          // Fehler werfen, wenn keine gültige Antwort kommt
          throw new Error('Fehler beim Laden des Rezepts');
        }
        return res.json(); // Antwort in JSON umwandeln
      })
      .then((data) => {
        // Rezeptdaten in den Zustand übernehmen
        setRecipe(data);
      })
      .catch((err) => {
        // Fehler in der Konsole ausgeben
        console.error(err.message);
      });
  }, [id]); // Effekt ausführen, wenn sich die ID ändert

  // Solange das Rezept noch nicht geladen ist → Ladeanzeige
  if (!recipe) return <p>Lade Rezept...</p>;

  // Sobald das Rezept vorhanden ist → Anzeige der Inhalte
  return (
    <div className="container mt-4" style={{ color: '#805437' }}>
      {/* Titel des Rezepts */}
      <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
        {recipe.title}
      </h2>

      {/* Zutatenliste */}
      <h4 style={{ fontSize: '1.8rem', marginTop: '2rem' }}>Zutaten:</h4>
      <p style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
        {recipe.ingredients}
      </p>

      {/* Zubereitungsanleitung */}
      <h4 style={{ fontSize: '1.8rem', marginTop: '2rem' }}>Zubereitung:</h4>
      <p style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
        {recipe.instructions}
      </p>

      {/* Rezeptbild anzeigen (falls vorhanden) */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt="Rezeptbild"
          style={{
            display: 'block',
            marginTop: '2rem',
            maxWidth: '100%',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}
        />
      )}
    </div>
  );
};

export default RecipeDetail;
