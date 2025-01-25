const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes pour le panier
router.post('/add', cartController.addToCart); // Ajouter un produit au panier
router.get('/', cartController.getCart); // Voir le contenu du panier
router.delete('/:id', cartController.removeFromCart); // Supprimer un produit du panier
router.put('/:id', cartController.updateCartItem); // Mettre à jour la quantité d'un produit

module.exports = router;
