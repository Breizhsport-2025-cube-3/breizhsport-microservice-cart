import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Utilisation des fonctions globales de test (describe, it, etc.)
    environment: 'node', // Indique que les tests sont exécutés côté serveur
  },
});
