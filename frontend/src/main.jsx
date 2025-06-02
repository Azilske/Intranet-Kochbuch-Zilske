/**
 * @file main.jsx
 * @description Einstiegspunkt der React-Anwendung „Topf Secret“.
 *              Bindet das Root-Element, lädt globale CSS-Dateien und rendert die App im StrictMode.
 */

import './index.css'; // Globale CSS-Datei der Anwendung (z. B. für Standard-Styling und Bootstrap-Anpassungen)
import { StrictMode } from 'react'; // React-Komponente zur Aktivierung zusätzlicher Entwicklungswarnungen
import { createRoot } from 'react-dom/client'; // Neue React-API zum Erstellen der Wurzel (ab React 18)
import App from './App.jsx'; // Hauptkomponente der Anwendung, enthält alle Seiten und Routing

// Einstiegspunkt: React rendert die App im StrictMode im <div id="root"> in der index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
