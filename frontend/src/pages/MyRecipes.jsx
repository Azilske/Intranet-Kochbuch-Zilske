/**
 * @file MyRecipes.jsx
 * @description Diese Komponente zeigt alle selbst erstellten Rezepte einer eingeloggten Nutzer:in an.
 *              Die Rezepte werden vom geschützten Backend-Endpunkt `/api/user-recipes` geladen.
 *              Jedes Rezept wird als `RecipeCard` dargestellt, bei eigenen Rezepten mit Edit/Delete-Buttons.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

/**
 * React-Komponente: MyRecipes
 * Ruft nach dem Login alle Rezepte der eingeloggten Person ab und zeigt sie an.
 *
 * @component
 * @returns {JSX.Element} Eine Seite mit eigenen Rezeptkarten im Grid-Layout
 */
const MyRecipes = () => {
  /** @type {[Array<Object>, Function]} */
  const [recipes, setRecipes] = useState([]); // Zustand für die geladenen Rezepte

  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true); // Zeigt an, ob der Serverantwort noch aussteht

  const navigate = useNavigate(); // Ermöglicht Umleitung zur Login-Seite bei fehlendem Token

  // useEffect: wird beim ersten Rendern der Seite einmal ausgeführt
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://dwg.mshome.net:3000/api/user-recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Fehler beim Laden der Rezepte:", error);
        setLoading(false);
      });
  }, [navigate]);

  /**
   * Löscht ein Rezept über das Backend und aktualisiert die Anzeige.
   *
   * @param {number} id – Die ID des Rezepts, das gelöscht werden soll
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Willst du dieses Rezept wirklich löschen?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nicht eingeloggt!");
      return;
    }

    try {
      const res = await fetch(`http://dwg.mshome.net:3000/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Erfolgreich gelöscht: Rezeptliste lokal aktualisieren
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      } else {
        console.error("⚠️ Fehler beim Löschen:", await res.text());
        alert("Löschen fehlgeschlagen.");
      }
    } catch (error) {
      console.error("❌ Netzwerkfehler beim Löschen:", error);
      alert("Server nicht erreichbar.");
    }
  };

  /**
   * Leitet zur Bearbeiten-Seite weiter, wenn Bearbeiten-Button geklickt wurde
   *
   * @param {number} id – Die ID des Rezepts, das bearbeitet werden soll
   */
  const handleEdit = (id) => {
    navigate(`/edit-recipe/${id}`);
  };

  // JSX-Ausgabe der Komponente
  return (
    <div
      className="my-recipes-page"
      style={{
        backgroundColor: "#f7f3eb",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          color: "#805437",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Meine Rezepte
      </h2>

        {/* Button zum Erstellen eines neuen Rezepts */}
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <button
        onClick={() => navigate("/new-recipe")}
        style={{
          backgroundColor: "#2a9d8f",
          color: "white",
          border: "none",
          padding: "0.6rem 1.2rem",
          fontSize: "1rem",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ➕ Neues Rezept erstellen
      </button>
    </div>


      {loading ? (
        <p style={{ textAlign: "center" }}>Lade deine Rezepte …</p>
      ) : recipes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Du hast noch keine Rezepte erstellt.</p>
      ) : (
        <div
          className="recipe-list"
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isOwnRecipe={true}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
