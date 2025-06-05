/**
 * @file RecipeCard.jsx
 * @description Einzelne Rezeptkarte mit Bild, Titel, Zutaten usw.
 *              Bei isOwnRecipe=true auch Buttons zum Bearbeiten/Löschen.
 *              Titel oder Bild sind klickbar und führen zur Detailansicht.
 */

import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Komponente RecipeCard
 *
 * @param {Object} props
 * @param {Object} props.recipe – Ein Rezeptobjekt vom Server
 * @param {Function} [props.onEdit] – Optionaler Callback zum Bearbeiten
 * @param {Function} [props.onDelete] – Optionaler Callback zum Löschen
 * @param {boolean} [props.isOwnRecipe] – true, wenn es ein eigenes Rezept ist
 * @returns {JSX.Element}
 */
export default function RecipeCard({ recipe, onEdit, onDelete, isOwnRecipe }) {
  const navigate = useNavigate(); // für Weiterleitung zur Detailansicht

  /**
   * Handler für Klick auf Titel oder Bild
   * Leitet zur Detailseite des Rezepts weiter (/recipes/:id)
   */
  const handleCardClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

      return (
      <div
        style={{
          width: "100%",             // ✅ passt sich dem Grid an
          maxWidth: "420px",         // ✅ nicht breiter als 420px
          boxSizing: "border-box",   // ✅ Padding wird mit eingerechnet
          backgroundColor: "#fffef8",
          border: "1px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          cursor: "pointer",
        }}
      >

      {/* Bild anzeigen, klickbar für Detailansicht */}
      {recipe.image_url && (
        <img
          src={`http://dwg.mshome.net:3000${recipe.image_url}`}
          alt={recipe.title}
          onClick={handleCardClick}
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
            backgroundColor: "#eee",
          }}
        />
      )}

      <div style={{ padding: "1.8rem", minHeight: "200px" }}>
        {/* Titel klickbar */}
        <h3
          onClick={handleCardClick}
          style={{
            fontSize: "1.6rem",
            color: "#805437",
            marginBottom: "0.5rem",
            cursor: "pointer",
          }}
        >
          {recipe.title}
        </h3>

       {/* Anzeigename des Erstellers */}
        {recipe.display_name && (
          <p style={{ fontSize: "1.1rem", color: "#777", marginBottom: "0.8rem" }}>
            von {recipe.display_name}
          </p>
        )}


        {/* Zutaten als Vorschau */}
        <p style={{ fontSize: "1.3rem", color: "#444" }}>{recipe.ingredients}</p>

        {/* Buttons nur bei eigenen Rezepten */}
        {isOwnRecipe && (
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(recipe.id);
              }}
              style={{
                padding: "0.4rem 1rem",
                fontSize: "1.2rem",
                backgroundColor: "#f4a261",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Bearbeiten
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(recipe.id);
              }}
              style={{
                padding: "0.4rem 1rem",
                fontSize: "1.2rem",
                backgroundColor: "#e76f51",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Löschen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
