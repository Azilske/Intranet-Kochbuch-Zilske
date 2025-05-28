import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite-Konfiguration
export default defineConfig({
  plugins: [react()],

  // Serverkonfiguration für den Netzwerkzugriff
  server: {
    host: true, // erlaubt Zugriff nicht nur über localhost
    allowedHosts: ['dwg.mshome.net'], // erlaubt explizit diesen Hostnamen
  },
});
