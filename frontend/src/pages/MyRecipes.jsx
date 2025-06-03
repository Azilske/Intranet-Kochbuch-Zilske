/**
 * @file MyRecipes.jsx – Zeigt alle Rezepte an, die ich selbst erstellt habe.
 * Ich kann sie später hier auch bearbeiten oder löschen.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Die Komponente MyRecipes zeigt alle eigenen Rezepte nach dem Login.
 * Sie holt die Daten vom Backend über einen API-Aufruf.
 */
const MyRecipes = () => {
  // useState zum Speichern der Rezepte
  const [recipes, setRecipes] = useState([]);

  // Navigation z. B. für Weiterleitungen später (bearbeiten etc.)
  const navigate = useNavigate();

  // Holt die eigenen Rezepte beim Laden der Seite
  useEffect(() => {
    // Holt das Token aus dem LocalStorage
    const token = localStorage.getItem("token");

    // Wenn kein Token vorhanden ist, zur Loginseite umleiten
    if (!token) {
      navigate("/login");
      return;
    }

    // API-Aufruf an /api/recipes/mine (diese Route bauen wir gleich im Backend)
    fetch("http://dwg.mshome.net:3001/api/recipes/mine", {
      headers: {
        Authorization: `Bearer ${token}`, // Auth-Header mit Token
      },
    })
      .then((res) => res.json())
      .then((data) => setRecipes(data)) // Rezepte in State speichern
      .catch((error) => {
        console.error("Fehler beim Laden der Rezepte:", error);
      });
  }, []);

  return (
    <div className="my-recipes-page" style={{ backgroundColor: "#f7f3eb", minHeight: "100vh", padding: "2rem" }}>
      <h2 style={{ color: "#805437", textAlign: "center", marginBottom: "2rem" }}>Meine Rezepte</h2>

      {recipes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Du hast noch keine Rezepte erstellt.</p>
      ) : (
        <div className="recipe-list" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card" style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
              <img src={recipe.image_url} alt={recipe.title} style={{ width: "100%", borderRadius: "10px" }} />
              <h3 style={{ color: "#805437", marginTop: "1rem" }}>{recipe.title}</h3>
              <p>{recipe.teaser}</p>
              {/* Buttons für spätere Bearbeiten- & Löschen-Funktion */}
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => navigate(`/edit/${recipe.id}`)} style={{ background: "#805437", color: "#fff", padding: "0.5rem 1rem", borderRadius: "5px" }}>
                  Bearbeiten
                </button>
                <button onClick={() => console.log("Löschen folgt")} style={{ background: "#c0392b", color: "#fff", padding: "0.5rem 1rem", borderRadius: "5px" }}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
