import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/', cartController.clearCart);
router.delete('/:id', cartController.removeFromCart);

// ✅ Vérification que updateCartItem est bien défini avant l'ajout de la route
if (cartController.updateCartItem) {
  router.put('/:productId', cartController.updateCartItem);
} else {
  console.error("❌ ERREUR : updateCartItem est undefined !");
}

export default router;
