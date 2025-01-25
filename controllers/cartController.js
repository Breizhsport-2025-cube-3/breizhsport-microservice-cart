const { Op } = require("sequelize");
const Cart = require("../models/cart")(require("../config/db"));

module.exports = {
  // Ajouter un produit au panier
  addToCart: async (req, res) => {
    try {
      const { productId, name, price, quantity } = req.body;

      if (!productId || !name || !price) {
        return res.status(400).json({
          message: 'Les champs "productId", "name" et "price" sont requis.',
        });
      }

      // Ajouter ou mettre à jour le produit dans le panier
      const [cartItem, created] = await Cart.findOrCreate({
        where: { productId },
        defaults: { name, price, quantity: quantity || 1 },
      });

      if (!created) {
        cartItem.quantity += quantity || 1;
        await cartItem.save();
      }

      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },

  // Récupérer tout le contenu du panier
  getCart: async (req, res) => {
    try {
      const cartItems = await Cart.findAll();
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },

  // Récupérer un article spécifique dans le panier par ID
  getCartItemById: async (req, res) => {
    try {
      const { id } = req.params;

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ message: "Produit non trouvé dans le panier." });
      }

      res.status(200).json(cartItem);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },

  // Mettre à jour un produit dans le panier
  updateCartItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: "La quantité doit être supérieure ou égale à 1.",
        });
      }

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ message: "Produit non trouvé dans le panier." });
      }

      cartItem.quantity = quantity;
      await cartItem.save();

      res.status(200).json(cartItem);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },

  // Supprimer un produit du panier
  removeFromCart: async (req, res) => {
    try {
      const { id } = req.params;

      const cartItem = await Cart.findByPk(id);

      if (!cartItem) {
        return res.status(404).json({ message: "Produit non trouvé dans le panier." });
      }

      await cartItem.destroy();
      res
        .status(200)
        .json({ message: "Produit supprimé du panier avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },

  // Vider tout le panier
  clearCart: async (req, res) => {
    try {
      await Cart.destroy({ where: {} });
      res.status(200).json({ message: "Panier vidé avec succès." });
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", details: error.message });
    }
  },
};
