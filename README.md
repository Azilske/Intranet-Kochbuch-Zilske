# Intranet-Kochbuch – Angela Zilske

## 📌 Projektbeschreibung
Diese Webanwendung wurde für einen internen Kochwettbewerb entwickelt. Nutzer*innen können eigene Rezepte erstellen, veröffentlichen, bearbeiten und löschen. Alle veröffentlichten Rezepte werden in einer öffentlichen Übersicht angezeigt. Ziel ist es, durch Likes und Kommentare das beliebteste Rezept zu küren, das schließlich auf der Grünen Woche live gekocht wird.

## 🔧 Tech-Stack
- **Frontend**: React (mit zentralem Routing über `App.jsx`)
- **Backend**: Node.js mit Express
- **Datenbank**: MariaDB
- **Authentifizierung**: JSON Web Tokens (JWT)
- **Dateiuploads**: Multer (für Rezept- und Profilbilder)
- **Styling**: Tailwind CSS

## 🚀 Features
- Nutzerregistrierung und Login
- Rezepte erstellen (mit Bild), anzeigen, bearbeiten, löschen
- Eigene Rezepte separat verwalten („Meine Rezepte“-Seite)
- Rezeptbilder werden direkt hochgeladen und dargestellt
- Öffentliche Rezeptübersicht inkl. Detailansicht
- Like-Funktion mit Anzeige der Like-Anzahl und persönlichem Status
- Kommentarfunktion mit Anzeige vorhandener Kommentare und eigenem Kommentarformular
- Profilseite inkl. Profilbild-Upload
- Fehlerbehandlung und Zugriffsschutz über Middleware

## 📂 Projektstruktur
- `frontend/` – React-App mit Seiten, Komponenten und Routing
- `routes/` – Express-Routen (`login`, `profile`, `recipes`, `userRecipes`, `likes`, `comments`)
- `uploads/` – Bilder für Rezepte und Profile
- `config/` – Datenbank- und Multer-Konfiguration
- `middleware/` – Authentifizierung per Token
- `index.js` – Einstiegspunkt für den Express-Server

## 🧪 Testdaten
Vier Beispielnutzer mit Profilbildern und acht erfundene Rezepte (inkl. Bildern, Likes und Kommentaren) sind enthalten.

## 🗃️ Datenbank
Die vollständige MariaDB-Datenbank `fi37_zilske_fpadw` wurde als Dump-Datei abgegeben:  
→ `zilske_dbdump.sql` (separat archiviert in `zilske_dbdump.zip`)

## 📝 Hinweise
- Alle **Pflichtfunktionen** wurden vollständig umgesetzt
- Die **optionalen Features** (Likes, Kommentare) sind ebenfalls implementiert
- Bilder werden direkt als Datei hochgeladen und im Frontend angezeigt
- Die Anwendung wurde eigenständig entwickelt, dokumentiert und getestet
- Design bewusst schlicht, Fokus auf Funktionalität und Vollständigkeit
