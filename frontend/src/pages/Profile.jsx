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

 /**
 * useEffect-Hook: Wird beim ersten Laden der Seite ausgeführt.
 * Prüft auf JWT-Token. Wenn vorhanden, holt er Profildaten vom Server (E-Mail, Anzeigename, Bildpfad).
 * Erkennt automatisch das Profilbild aus der Datenbank und setzt eine Vorschau-URL mit Port 3000.
 * Debug-Ausgaben in der Konsole helfen bei der Fehlersuche (werden später entfernt).
 */
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ Kein Token gefunden – leite zu /login um.');
    navigate('/login');
    return;
  }

  // Feste Backend-URL mit Port 3000 (nicht Port 5173!)
  const backendBaseUrl = 'http://dwg.mshome.net:3000';

  // GET /api/profile → holt Profildaten vom Server
  fetch(`${backendBaseUrl}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // Token wird zur Authentifizierung mitgeschickt
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Profil konnte nicht geladen werden');
      return res.json();
    })
    .then((data) => {
      // 💬 Debug: gesamte Antwort in der Konsole anzeigen

      // Profildaten im State setzen
      setProfile((prev) => ({
        ...prev,
        email: data.email || '',
        displayName: data.displayName || '',
      }));

      // Bildpfad aus der DB vorhanden? → Vorschau-URL setzen
      if (data.image) {
        const fullUrl = `${backendBaseUrl}${data.image}`;
        setPreviewUrl(fullUrl);
      } else {
      }
    })
    .catch((err) => {
      console.error('❌ Fehler beim Laden des Profils:', err);
    });
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
   * PUT /api/profile/profile-picture
   * Lädt das gewählte Profilbild als Datei hoch und speichert den relativen Pfad
   * dauerhaft in der Datenbank (Spalte: user.image). Bei Erfolg wird die Vorschau aktualisiert.
   */
  const handleUploadAndSave = async () => {
    // Kein Bild ausgewählt → Abbruch
    if (!profile.profileImage) {
      setUploadMessage('⚠️ Bitte wähle ein Bild aus.');
      return;
    }

    // Bild in FormData-Objekt verpacken
    const formData = new FormData();
    formData.append('profileImage', profile.profileImage); // ← Muss mit dem Multer-Feldnamen übereinstimmen

    try {
      // Anfrage an den Server senden (PUT /api/profile/profile-picture)
      const res = await fetch('http://dwg.mshome.net:3000/api/profile/profile-picture', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Nur Token, kein Content-Type!
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Rückmeldung + Vorschau aktualisieren
        setUploadMessage('✅ Profilbild wurde gespeichert.');
        setPreviewUrl(`http://dwg.mshome.net:3000${data.imagePath}`); // ← KORREKT: absolute URL setzen
      } else {
        setUploadMessage('⚠️ Fehler beim Speichern.');
      }
    } catch (err) {
      console.error(err);
      setUploadMessage('❌ Serverfehler beim Speichern des Bildes.');
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
                onClick={handleUploadAndSave}
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
