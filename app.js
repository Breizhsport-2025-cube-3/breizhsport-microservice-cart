import express from "express";
import cartRoutes from "./routes/cartRoutes.js";
import sequelize from "./config/db.js"; // Ajout du ".js"

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware JSON
app.use(express.json());

// Utilisation des routes
app.use("/cart", cartRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error("Erreur de synchronisation avec la base de données:", err));

export default app; // Exporter app pour les tests avec Vitest
