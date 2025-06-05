/**
 * @file RecipeDetail.jsx
 * @description Detailansicht für ein einzelnes Rezept – inkl. Like- & Kommentar-Funktion
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Komponente RecipeDetail
 * Zeigt alle Infos zu einem einzelnen veröffentlichten Rezept.
 * → Inklusive Like-Zähler, Like-Toggle, Kommentaranzeige & Kommentarformular
 *
 * @component
 * @returns {JSX.Element}
 */
export default function RecipeDetail() {
  const { id } = useParams(); // Holt die Rezept-ID aus der URL

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [likeCount, setLikeCount] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Rezeptdaten laden
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Rezept nicht gefunden oder Zugriff verweigert");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Dieses Rezept konnte nicht geladen werden.");
        setLoading(false);
      });
  }, [id]);

  // Likes laden
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}/likes`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLikeCount(data.likeCount);
        setLikedByUser(data.likedByUser);
      })
      .catch((err) => console.error("Fehler beim Laden der Likes:", err));
  }, [id]);

  // Kommentare laden
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Fehler beim Laden der Kommentare:", err));
  }, [id]);

  // Like-Toggle
  const handleLikeToggle = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bitte zuerst einloggen, um ein Rezept zu liken.");
      return;
    }
    fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLikedByUser(data.liked);
        setLikeCount((prev) => prev + (data.liked ? 1 : -1));
      })
      .catch((err) => console.error("Fehler beim Liken:", err));
  };

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Lädt …</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h2
        style={{
          color: "#6b4226",
          fontSize: "2.8rem",
          fontWeight: "600",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        {recipe.title}
      </h2>


      {recipe.image_url && (
        <img
          src={`http://dwg.mshome.net:3000${recipe.image_url}`}
          alt={recipe.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            marginBottom: "1rem",
            borderRadius: "10px",
          }}
        />
      )}

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleLikeToggle}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: likedByUser ? "#b33c3c" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          {likedByUser ? "❤️ Liked" : "🤍 Like"}
        </button>
        <span>{likeCount} Like{likeCount !== 1 && "s"}</span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Zutaten</h3>
        <p style={{ fontSize: "1.4rem", lineHeight: "1.6" }}>{recipe.ingredients}</p>

      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Zubereitung</h3>
        <p style={{ fontSize: "1.4rem", lineHeight: "1.6" }}>{recipe.instructions}</p>

      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Kommentare</h3>

        {comments.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>Noch keine Kommentare vorhanden.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {comments.map((comment) => (
              <li
                key={comment.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>{comment.display_name}</strong> · {" "}
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  {new Date(comment.created_at).toLocaleString("de-DE")}
                </span>
                <p style={{ marginTop: "0.5rem" }}>{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        {localStorage.getItem("token") ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              if (!newComment.trim()) return;

              fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/recipes/${id}/comments`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: newComment }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setComments((prev) => [
                    ...prev,
                    {
                      id: data.commentId,
                      text: newComment,
                      created_at: new Date().toISOString(),
                      display_name: "Du",
                    },
                  ]);
                  setNewComment("");
                })
                .catch((err) => console.error("Kommentar konnte nicht gespeichert werden:", err));
            }}
            style={{ marginTop: "1rem" }}
          >
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Kommentar schreiben …"
                rows="4"
                style={{
                  width: "100%",
                  padding: "1.2rem",
                  fontSize: "1.4rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                  resize: "vertical",
                }}
              ></textarea>

            <button
              type="submit"
               style={{
                padding: "1rem 2rem",
                fontSize: "1.3rem",
                backgroundColor: "#6b4226",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}

            >
              Kommentar absenden
            </button>
          </form>
        ) : (
          <p style={{ fontStyle: "italic" }}>Zum Kommentieren bitte einloggen.</p>
        )}
      </div>
    </div>
  );
}
