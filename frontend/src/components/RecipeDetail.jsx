/**
 * @file RecipeDetail.jsx
 * @description Detailansicht für ein einzelnes Rezept im Intranet-Kochbuch.
 *              Holt das Rezept per ID aus der API und zeigt Titel, Zutaten, Zubereitung und Bild.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  // useParams holt die ID aus der URL – z. B. /recipes/42 → id = "42"
  const { id } = useParams();

  // State für das aktuell geladene Rezept
  const [recipe, setRecipe] = useState(null);

  // Beim ersten Rendern (und bei ID-Wechsel) Rezeptdaten von API holen
  useEffect(() => {
    // Daten abrufen von der API (per ID)
    fetch(`http://dwg.mshome.net:3000/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Fehler beim Laden des Rezepts');
        return res.json();
      })
      .then((data) => {
        setRecipe(data); // Rezept im State speichern
      })
      .catch((err) => {
        console.error(err.message); // Fehler in der Konsole anzeigen
      });
  }, [id]);

  // Wenn Rezept noch nicht geladen ist → Ladeanzeige
  if (!recipe) return <p>Lade Rezept...</p>;

  // Rezeptinhalte anzeigen
  return (
    <div style={{ padding: '2rem', color: '#805437' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{recipe.title}</h2>

      <h4 style={{ fontSize: '1.8rem', marginTop: '2rem' }}>Zutaten:</h4>
      <p style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>{recipe.ingredients}</p>

      <h4 style={{ fontSize: '1.8rem', marginTop: '2rem' }}>Zubereitung:</h4>
      <p style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>{recipe.instructions}</p>

      {/* Falls ein Bild vorhanden ist, anzeigen */}
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
