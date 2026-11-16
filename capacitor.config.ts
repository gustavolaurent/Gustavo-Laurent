import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.treinta.asistencia',
  appName: 'TREINTA Asistencia',
  webDir: 'dist',
  server: {
    // La app Android carga la versión segura alojada en Render para mantener
    // la misma sesión y los endpoints del ERP sin duplicar el backend.
    url: 'https://treinta-asistencia-app.onrender.com',
    cleartext: false,
    allowNavigation: ['treinta-asistencia-app.onrender.com', 'treinta-gestion-integral-sn9h.onrender.com']
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
