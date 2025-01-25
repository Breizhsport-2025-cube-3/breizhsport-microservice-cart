const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Assurez-vous que c'est 'mysql' pour MySQL
    logging: false, // Désactive les logs SQL (optionnel)
    pool: {
        max: 10, // Nombre maximum de connexions dans le pool
        min: 0,  // Nombre minimum de connexions dans le pool
        acquire: 30000, // Temps maximum (en ms) pour acquérir une connexion
        idle: 10000, // Temps maximum (en ms) pendant lequel une connexion peut être inactive
    },
});

// Teste la connexion
sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données réussie.'))
    .catch(err => console.error('Impossible de se connecter à la base de données:', err));

module.exports = sequelize;