/**
 * @file RecipeList.jsx
 * @description Öffentliche Rezeptübersicht: Zeigt alle veröffentlichten Rezepte im Grid.
 *              Verwendet die RecipeCard-Komponente (ohne Bearbeiten/Löschen).
 */

import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

/**
 * React-Komponente: RecipeList
 * Holt alle veröffentlichten Rezepte vom Server und zeigt sie im Grid an.
 * 
 * @returns {JSX.Element} Komponente mit Grid-Ansicht veröffentlichter Rezepte
 */
const RecipeList = () => {
  /** @type {[Array<Object>, Function]} */
  const [recipes, setRecipes] = useState([]);

  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true); // Ladeanzeige aktiv

  // Beim ersten Render: Rezepte vom Server laden
  useEffect(() => {
    fetch("http://dwg.mshome.net:3000/api/recipes") // öffentliche API
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fehler beim Laden der Rezepte:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="recipe-list-page"
      style={{
        backgroundColor: "#f7f3eb", // Stil wie bei MyRecipes
        minHeight: "100vh",
        padding: "4rem 2rem 6rem 2rem", // oben, rechts, unten, links
      }}
    >
      {/* Überschrift und Wettbewerbsbeschreibung */}
      <h1 style={{ fontSize: "4rem", marginBottom: "2rem", color: "#6b4226", textAlign: "center" }}>
        Topf Secret – Eure Rezepte
      </h1>
      <p style={{ fontSize: "2rem", marginBottom: "1.5rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        Ob allein, im Team oder als Gruppe – hier könnt ihr eure Kreationen einreichen, das Jahr über Likes sammeln
        und euch die Chance sichern, live auf der Grünen  Woche mit echten Stars als Gästen zu kochen! Die Beiträge mit den meisten Likes gewinnen:
        Bühne, Ruhm und vielleicht sogar der Sprung ins nächste Karrierestadium. Zeigt, was in euch steckt – und was in euren Töpfen brodelt!
      </p>

      {/* Ladeanzeige oder Grid */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Rezepte werden geladen …</p>
      ) : recipes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Noch keine veröffentlichten Rezepte.</p>
      ) : (
        <div
          className="recipe-grid"
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", // schon korrekt
            justifyContent: "center", // NEU: zentriert Karten, wenn nicht ganz voll
            width: "100%",            // NEU: volle Breite nutzen
            maxWidth: "1200px",       // NEU: begrenzt auf schöne Desktop-Breite
            margin: "0 auto",         // NEU: zentriert auf der Seite
          }}
        >

          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
