/**
 * @file NewRecipe.jsx
 * @description Seite zum Erstellen eines neuen Rezepts mit Bild-Upload und Vorschau.
 *              Nutzt das gleiche Layout wie EditRecipe, aber mit größerem Formular und Bildvorschau.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Komponente NewRecipe – Seite zum Erstellen eines Rezepts mit Bild.
 *
 * @returns {JSX.Element} Formularseite für ein neues Rezept.
 */
export default function NewRecipe() {
  const navigate = useNavigate();

  // Zustand für das gesamte Formular (Textfelder + Bild)
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image: null, // Bild-Datei (wird nicht als Text gespeichert, sondern als Datei)
  });

  // Zustand für die lokale Vorschau des Bilds
  const [previewUrl, setPreviewUrl] = useState(null);

  // Zustand für potenzielle Fehlermeldungen
  const [error, setError] = useState(null);

  /**
   * handleChange – reagiert auf Änderungen in den Textfeldern
   * Aktualisiert den Formularzustand (z. B. Titel, Zutaten, Zubereitung)
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * handleImageChange – wird aufgerufen, wenn ein Bild ausgewählt wird.
   * Speichert die Datei im Zustand und zeigt eine Vorschau.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file)); // Erzeugt eine temporäre Vorschau-URL im Browser
    }
  };

  /**
   * handleSubmit – sendet das neue Rezept inklusive Bild an den Server
   * Verwendet FormData für den multipart/form-data Upload
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Token holen für Authentifizierung
    const form = new FormData();

    // Alle Felder in das FormData-Objekt einfügen
    form.append("title", formData.title);
    form.append("ingredients", formData.ingredients);
    form.append("instructions", formData.instructions);
    if (formData.image) {
      form.append("image", formData.image); // Bild hinzufügen, wenn vorhanden
    }
    form.append("published", "1"); // Rezept direkt als veröffentlicht speichern (als String für FormData/MySQL)

    try {
      const res = await fetch("http://dwg.mshome.net:3000/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form, // wichtig: kein Content-Type setzen, das macht FormData automatisch
      });

      if (!res.ok) {
        throw new Error("Rezept konnte nicht erstellt werden");
      }

      const data = await res.json();

      // Weiterleitung zur Übersichtsseite „Meine Rezepte“
      navigate("/my-recipes");
    } catch (err) {
      console.error(err);
      setError("Fehler beim Speichern des Rezepts.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#805437", marginBottom: "1.5rem" }}>Neues Rezept erstellen</h2>

      {/* Rezept-Formular */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Titel-Eingabe */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="title">Titel:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "1.2rem",
              fontSize: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

        </div>

        {/* Zutaten-Eingabe */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="ingredients">Zutaten:</label>
          <textarea
              id="ingredients"
              name="ingredients"
              rows={6}
              required
              value={formData.ingredients}
              onChange={handleChange}
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

        {/* Zubereitungs-Eingabe */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="instructions">Zubereitung:</label>
          <textarea
            id="instructions"
            name="instructions"
            rows={8}
            required
            value={formData.instructions}
            onChange={handleChange}
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

        {/* Bild-Upload */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="image">Rezeptbild hochladen:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "block", marginTop: "0.5rem" }}
          />
        </div>

        {/* Bildvorschau */}
        {previewUrl && (
          <div style={{ marginBottom: "1.5rem" }}>
            <strong>Bildvorschau:</strong>
            <img
              src={previewUrl}
              alt="Vorschau"
              style={{
                marginTop: "0.5rem",
                maxWidth: "100%",
                borderRadius: "10px",
                boxShadow: "0 0 8px rgba(0,0,0,0.2)"
              }}
            />
          </div>
        )}

        {/* Fehleranzeige */}
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        {/* Absenden-Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#f4a261",
            border: "none",
            padding: "0.8rem 1.5rem",
            fontSize: "1.1rem",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Rezept speichern
        </button>
      </form>
    </div>
  );
}
