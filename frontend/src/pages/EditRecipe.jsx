/**
 * @file EditRecipe.jsx
 * @description Seite zum Bearbeiten eines eigenen Rezepts.
 *              Lädt das bestehende Rezept vom Server und ermöglicht die Aktualisierung per Formular.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Komponente EditRecipe
 * Holt ein Rezept nach ID aus dem Backend und zeigt ein Bearbeitungsformular.
 * Nach dem Speichern wird ein PUT-Request an den Server geschickt.
 *
 * @component
 * @returns {JSX.Element} Formularseite zum Bearbeiten eines Rezepts
 */
export default function EditRecipe() {
  const { id } = useParams();         // Holt die Rezept-ID aus der URL (/edit-recipe/:id)
  const navigate = useNavigate();     // Navigation nach erfolgreichem Speichern

  const [recipe, setRecipe] = useState(null);  // Zustand: aktuelles Rezept
  const [error, setError] = useState(null);    // Zustand: Fehlermeldung (optional)
  const [loading, setLoading] = useState(true); // Zustand: Ladeanzeige

  /**
   * useEffect: Lädt das vorhandene Rezept vom Server
   * Wird nur einmal ausgeführt (beim Laden der Seite)
   */
  useEffect(() => {
    const token = localStorage.getItem("token"); // Token aus dem LocalStorage holen

    // API-Request: GET /api/recipes/:id
    fetch(`http://dwg.mshome.net:3000/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);       // Rezept in Zustand übernehmen
        setLoading(false);     // Ladeanzeige beenden
      })
      .catch((err) => {
        console.error(err);
        setError("Rezept konnte nicht geladen werden.");
        setLoading(false);
      });
  }, [id]);

  /**
   * handleChange: Aktualisiert einzelne Felder des Rezepts im Zustand
   * @param {Event} e - Das Eingabeereignis
   */
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit: Sendet das bearbeitete Rezept per PUT an den Server
   * @param {Event} e - Das Formularevent
   */
  const handleSubmit = (e) => {
    e.preventDefault();


    const token = localStorage.getItem("token");

  

    // API-Request: PUT /api/recipes/:id
    fetch(`http://dwg.mshome.net:3000/api/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image_url: recipe.image_url,     // ← wichtig!
        published: recipe.published || 0 // ← fallback
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Speichern");
        return res.json();
      })
      .then(() => {
        navigate("/my-recipes"); // Zurück zur Übersichtsseite
      })
      .catch((err) => {
        console.error(err);
        setError("Speichern fehlgeschlagen.");
      });
  };

  // Anzeige während des Ladevorgangs
  if (loading) return <p style={{ textAlign: "center" }}>Lade Rezept …</p>;

  // Anzeige im Fehlerfall
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  // Formular zur Bearbeitung des Rezepts
  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ color: "#805437", marginBottom: "1rem" }}>Rezept bearbeiten</h2>

      <form onSubmit={handleSubmit}>
        {/* Titel-Feld */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="title">Titel:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "1.2rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}

          />
        </div>

        {/* Zutaten-Feld */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="ingredients">Zutaten:</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
            rows={4}
            style={{
              width: "100%",
              padding: "1.2rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}

          />
        </div>

        {/* Zubereitung-Feld */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="instructions">Zubereitung:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
            rows={6}
            style={{
              width: "100%",
              padding: "1.2rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}

          />
        </div>

        {/* Speichern-Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#f4a261",
            border: "none",
            padding: "0.6rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
