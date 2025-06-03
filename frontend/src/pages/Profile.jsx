/**
 * @file Profile.jsx
 * @description Profilseite für eingeloggte Benutzer:innen im Intranet-Kochbuch „Topf Secret“.
 *              Zeigt das runde Profilbild (inkl. Upload-Funktion), erlaubt Änderungen an E-Mail,
 *              Anzeigename, Passwort und bietet das optisch einheitliche Layout mit Icons & Skyline.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @component Profile
 * @returns {JSX.Element} Die persönliche Profilseite mit Formular zur Bearbeitung und Bild-Upload
 */
export default function Profile() {
  const navigate = useNavigate(); // Für Weiterleitung bei fehlendem Token

  // Zustand für Profildaten (E-Mail, Anzeigename, Passwort, Bild)
  const [profile, setProfile] = useState({
    email: '',
    displayName: '',
    password: '',
    profileImage: null, // ← Dateiobjekt für das ausgewählte Bild
  });

  // Vorschau-URL für das gewählte Bild im Dateieingabefeld
  const [previewUrl, setPreviewUrl] = useState(null);

  // Zustand für die Upload-Erfolg-/Fehlermeldung
  const [uploadMessage, setUploadMessage] = useState(null);

  // Beim ersten Laden der Seite: Token prüfen + Daten vom Server holen
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // ← Kein Token → Zurück zum Login
      return;
    }

    // GET /api/profile: Holt E-Mail und Anzeigename
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

  /**
   * Aktualisiert die Eingabewerte oder Bild-Datei im Profil-Zustand
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Datei oder normaler Wert
    }));
  };

  /**
   * Zeigt Bildvorschau nach Dateiauswahl
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile((prev) => ({
      ...prev,
      profileImage: file, // ← Bild im State speichern
    }));

    // Vorschau-URL setzen (für <img>)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * POST /api/profile/upload: Sendet das Bild an den Server
   */
  const handleUpload = async () => {
    if (!profile.profileImage) return;

    const formData = new FormData(); // ← Bild muss als FormData gesendet werden
    formData.append('profileImage', profile.profileImage);

    try {
      const res = await fetch('http://dwg.mshome.net:3000/api/profile/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Nur Token, kein Content-Type!
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadMessage('✅ Bild erfolgreich hochgeladen!');
        // Optional: Vom Server zurückgegebenen Pfad speichern
        // setPreviewUrl(data.imagePath);
      } else {
        setUploadMessage('⚠️ Fehler beim Hochladen.');
      }
    } catch (err) {
      console.error(err);
      setUploadMessage('❌ Serverfehler beim Hochladen.');
    }
  };

  /**
   * PUT /api/profile: Sendet E-Mail, Passwort und Anzeigename an den Server
   */
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
      setProfile((prev) => ({ ...prev, password: '' })); // Passwort leeren nach Speichern
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Hauptbereich der Profilseite */}
      <main style={{ backgroundColor: '#f7f3eb', padding: '2rem 0' }}>
        <div className="container">
          {/* Flex-Container mit zwei Icons und Formular */}
          <div className="d-flex justify-content-center align-items-start flex-wrap gap-5 mb-5">
            {/* Icon: Startseite */}
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

            {/* Formularbereich – Profilbild & Angaben */}
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

              {/* Bildvorschau wenn vorhanden */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Profilbild Vorschau"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1rem',
                  }}
                />
              )}

              {/* Datei-Auswahl für Bild */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Upload-Button */}
              <button
                type="button"
                onClick={handleUpload}
                style={{
                  backgroundColor: '#d3e8cc',
                  color: '#2c6e49',
                  padding: '0.7rem 1.5rem',
                  fontSize: '1.4rem',
                  borderRadius: '8px',
                  border: 'none',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                Profilbild speichern
              </button>

              {/* Rückmeldung (Erfolg/Fehler) */}
              {uploadMessage && <p style={{ fontSize: '1.3rem' }}>{uploadMessage}</p>}

              {/* Formular zur Profilbearbeitung */}
              <form onSubmit={handleSave}>
                {/* E-Mail-Adresse */}
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

                {/* Button zum Speichern */}
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

              {/* Hinweis auf zukünftige Rezeptliste */}
              <div style={{ marginTop: '3rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Meine Rezepte</h4>
                <p style={{ fontSize: '1.4rem' }}>
                  Hier könnten deine eigenen Rezepte erscheinen <br />
                  (Backend-Anbindung folgt).
                </p>
              </div>
            </div>

            {/* Icon: Rezepte-Seite */}
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

          {/* Dekorative Skyline */}
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
