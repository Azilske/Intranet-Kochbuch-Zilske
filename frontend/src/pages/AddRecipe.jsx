/**
 * @file AddRecipe.jsx
 * @description Rezept-Erstellseite – ermöglicht es mir, ein neues Rezept hochzuladen.
 *              Ich kann Titel, Zutaten, Zubereitung und ein Bild angeben.
 */

import React, { useState } from "react"; // React und useState-Hook importieren
import { useNavigate } from "react-router-dom"; // Für Weiterleitungen nach dem Absenden

/**
 * Komponente zum Erstellen eines neuen Rezepts.
 *
 * @returns {JSX.Element} Formularseite zur Rezepterstellung.
 */
const AddRecipe = () => {
  // Eingabefelder als State speichern
  const [title, setTitle] = useState(""); // Titel des Rezepts
  const [ingredients, setIngredients] = useState(""); // Zutatenliste
  const [instructions, setInstructions] = useState(""); // Zubereitung
  const [image, setImage] = useState(null); // Hochgeladenes Bild
  const [message, setMessage] = useState(""); // Info-/Fehlermeldung

  const navigate = useNavigate(); // Navigation z. B. zur Rezeptseite nach dem Absenden

  /**
   * Wird aufgerufen, wenn das Formular abgesendet wird.
   * Sendet das Rezept per POST an die API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Standardverhalten des Browsers verhindern

    // Token aus dem LocalStorage lesen (für Authentifizierung)
    const token = localStorage.getItem("token");

    // Falls kein Token vorhanden, zum Login weiterleiten
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // FormData-Objekt für multipart/form-data erstellen
      const formData = new FormData();
      formData.append("title", title); // Titel hinzufügen
      formData.append("ingredients", ingredients); // Zutaten hinzufügen
      formData.append("instructions", instructions); // Zubereitung hinzufügen
      if (image) {
        formData.append("image", image); // Falls ein Bild vorhanden ist
      }

      // POST-Anfrage an die API schicken
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes`, {
        method: "POST", // Methode: POST
        headers: {
          Authorization: `Bearer ${token}`, // Auth-Header mit JWT
        },
        body: formData, // Formulardaten als Body
      });

      // Wenn Antwort nicht ok ist → Fehler werfen
      if (!response.ok) {
        throw new Error("Fehler beim Hochladen des Rezepts");
      }

      // Erfolgsmeldung anzeigen und danach weiterleiten
      setMessage("Rezept erfolgreich erstellt!");
      setTimeout(() => navigate("/my-recipes"), 1500); // Nach 1,5s zu "Meine Rezepte"
    } catch (error) {
      console.error("Fehler beim Hochladen:", error); // Fehler in Konsole anzeigen
      setMessage("Es ist ein Fehler aufgetreten."); // Meldung für den Benutzer
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px", color: "#805437" }}>
      {/* Überschrift */}
      <h2 style={{ marginBottom: "2rem" }}>Neues Rezept erstellen</h2>

      {/* Feedbackmeldung (Erfolg oder Fehler) */}
      {message && (
        <div style={{ marginBottom: "1rem", color: message.includes("Fehler") ? "red" : "green" }}>
          {message}
        </div>
      )}

      {/* Das Rezeptformular */}
      <form onSubmit={handleSubmit}>
        {/* Eingabefeld: Titel */}
        <div className="mb-3">
          <label className="form-label">Titel</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Eingabefeld: Zutaten */}
        <div className="mb-3">
          <label className="form-label">Zutaten</label>
          <textarea
            className="form-control"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows="4"
            required
          />
        </div>

        {/* Eingabefeld: Zubereitung */}
        <div className="mb-3">
          <label className="form-label">Zubereitung</label>
          <textarea
            className="form-control"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows="6"
            required
          />
        </div>

        {/* Datei-Upload: Bild */}
        <div className="mb-3">
          <label className="form-label">Bild</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Absenden-Button */}
        <button
          type="submit"
          className="btn btn-warning"
          style={{
            backgroundColor: "#f4a261",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Rezept speichern
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
