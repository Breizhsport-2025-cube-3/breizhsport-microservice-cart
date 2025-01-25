// Controller pour Cart
const Cart = require('../models/cart')(require('../config/db'));

module.exports = {
  // Ajouter un produit au panier
  addToCart: async (req, res) => {
    try {
      const { productId, name, price, quantity } = req.body;
  
      // Log les données reçues
      console.log('Données reçues dans la requête :', req.body);
  
      if (!productId || !name || !price) {
        return res.status(400).json({ message: 'Les champs productId, name et price sont requis.' });
      }
  
      // Log l'action en cours
      console.log('Vérification si le produit existe déjà dans le panier...');
  
      const [cartItem, created] = await Cart.findOrCreate({
        where: { productId },
        defaults: { name, price, quantity: quantity || 1 },
      });
  
      if (created) {
        console.log('Produit créé dans le panier :', cartItem);
      } else {
        console.log('Produit déjà présent, mise à jour de la quantité...');
        cartItem.quantity += quantity || 1;
        await cartItem.save();
        console.log('Produit mis à jour :', cartItem);
      }
  
      res.status(201).json(cartItem);
    } catch (error) {
      console.error(`Erreur lors de l'ajout au panier : ${error.message}`);
      res.status(500).json({ message: `Erreur interne du serveur : ${error.message}` });
    }
  },
  

  // Voir le contenu du panier
  getCart: async (req, res) => {
    try {
      const cartItems = await Cart.findAll();
      res.status(200).json(cartItems);
    } catch (error) {
      console.error(`Erreur lors de la récupération du panier : ${error.message}`);
      res.status(500).json({ message: `Erreur interne du serveur : ${error.message}` });
    }
  },

  // Supprimer un produit du panier
  removeFromCart: async (req, res) => {
    try {
      const { id } = req.params;

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier.' });
      }

      await cartItem.destroy();
      res.status(200).json({ message: 'Produit supprimé du panier avec succès.' });
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit du panier : ${error.message}`);
      res.status(500).json({ message: `Erreur interne du serveur : ${error.message}` });
    }
  },

  // Mettre à jour la quantité d'un produit dans le panier
  updateCartItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'La quantité doit être supérieure ou égale à 1.' });
      }

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier.' });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      res.status(200).json(cartItem);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit dans le panier : ${error.message}`);
      res.status(500).json({ message: `Erreur interne du serveur : ${error.message}` });
    }
  },
};
