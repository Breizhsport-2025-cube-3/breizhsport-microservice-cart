const express = require('express');
const sequelize = require('./config/db');
const cartRoutes = require('./routes/cartRoutes');

// Importez et initialisez le modèle Product
const Cart = require('./models/cart')(sequelize);

const app = express();
const PORT = process.env.PORT; // Ajoutez une valeur par défaut pour PORT

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/cart', cartRoutes);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Erreur de synchronisation avec la base de données:', err));