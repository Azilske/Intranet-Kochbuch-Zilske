/**
 * @file Profile.jsx
 * @description Profilseite für eingeloggte Benutzer:innen im Intranet-Kochbuch „Topf Secret“.
 *              Zeigt das runde Profilbild, erlaubt Änderungen an E-Mail, Anzeigename, Passwort
 *              und bietet das optisch einheitliche Layout mit Icons & Skyline.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate(); // Für Weiterleitung, wenn kein Token

  // Zustand für Profilfelder
  const [profile, setProfile] = useState({
    email: '',
    displayName: '',
    password: '',
    profileImage: null,
  });

  // Lädt Profildaten nach dem ersten Rendern
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Umleitung bei fehlendem Token
      return;
    }

    fetch('http://dwg.mshome.net:3000/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Profil konnte nicht geladen werden');
        return res.json();
      })
      .then((data) => {
        setProfile((prev) => ({
          ...prev,
          email: data.email || '',
          displayName: data.displayName || '',
        }));
      })
      .catch((err) => console.error(err.message));
  }, [navigate]);

  // Formularfelder aktualisieren
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Profildaten speichern
  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const updatedData = {
      email: profile.email,
      displayName: profile.displayName,
      password: profile.password,
    };

    try {
      const res = await fetch('http://dwg.mshome.net:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Fehler beim Speichern des Profils');
      alert('Profil erfolgreich gespeichert!');
      setProfile((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Hauptbereich */}
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
        <div className="container">
          {/* Icons links und rechts */}
          <div className="d-flex justify-content-center align-items-start flex-wrap gap-5 mb-5">
            {/* Icon Startseite */}
            <div className="text-center" style={{ flex: '1' }}>
              <a href="/">
                <img
                  src="/images/icon-home.png"
                  alt="Startseite"
                  style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                />
              </a>
              <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>
                Startseite
              </p>
            </div>

            {/* Formularbereich */}
            <div
              style={{
                maxWidth: '650px',
                flex: '2',
                textAlign: 'center',
                fontSize: '1.6rem',
                color: '#805437',
              }}
            >
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Mein Profil</h2>

              {/* Profilbild anzeigen */}
              <img
                src="/images/Profilbild.jpg"
                alt="Profilbild"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                }}
              />

              {/* Datei-Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />
              </div>

              {/* Formular */}
              <form onSubmit={handleSave}>
                {/* E-Mail */}
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label htmlFor="email">E-Mail-Adresse</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1.6rem',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      marginTop: '0.5rem',
                    }}
                  />
                </div>

                {/* Anzeigename */}
                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                  <label htmlFor="displayName">Anzeigename</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    required
                    placeholder="z. B. KüchenQueen2025"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1.6rem',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      marginTop: '0.5rem',
                    }}
                  />
                </div>

                {/* Passwort ändern */}
                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                  <label htmlFor="password">Passwort ändern</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    placeholder="Neues Passwort"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1.6rem',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      marginTop: '0.5rem',
                    }}
                  />
                </div>

                {/* Speichern-Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#f4a261',
                    color: '#805437',
                    fontWeight: 'bold',
                    padding: '1rem',
                    fontSize: '1.6rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Profil aktualisieren
                </button>
              </form>

              {/* Eigene Rezepte Hinweis */}
              <div style={{ marginTop: '3rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Meine Rezepte</h4>
                <p style={{ fontSize: '1.4rem' }}>
                  Hier könnten deine eigenen Rezepte erscheinen <br />
                  (Backend-Anbindung folgt).
                </p>
              </div>
            </div>

            {/* Icon Rezepte */}
            <div className="text-center" style={{ flex: '1' }}>
              <a href="/recipes">
                <img
                  src="/images/icon-rezepte.png"
                  alt="Rezepte"
                  style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                />
              </a>
              <p className="mt-2" style={{ fontWeight: 'bold', color: '#805437' }}>Rezepte</p>
            </div>
          </div>

          {/* Skyline-Bild unten */}
          <div className="text-center mt-5">
            <img
              src="/images/TopfSecretBerlin2.png"
              alt="Topf Secret Skyline"
              style={{
                maxWidth: '1000px',
                height: 'auto',
                margin: '3rem auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
