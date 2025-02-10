import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import cartRoutes from "../routes/cartRoutes.js";
import sequelize from "../config/db.js";
import cartModel from "../models/cart.js";
import cartController from "../controllers/cartController.js";

// Initialisation du modèle Sequelize avec la base de données
const Cart = cartModel(sequelize);

// Création d'un serveur express pour tester les routes
const app = express();
app.use(express.json());
app.use("/cart", cartRoutes);

// ⚠ Réinitialisation de la base de données avant chaque test
beforeEach(async () => {
  await sequelize.sync({ force: true }); // Réinitialise la base de données
});

// Tests API existants
describe("🛒 Microservice Cart - Tests API", () => {
  // Tests fonctionnels
  it("✅ [Tests fonctionnels] Ajout d'un produit au panier (POST /cart/add)", async () => {
    const response = await request(app)
      .post("/cart/add")
      .send({ productId: 1, name: "Short de running", price: 30, quantity: 1 });

    expect(response.status).toBe(201);
    expect(response.body.productId).toBe(1);
    expect(response.body.name).toBe("Short de running");
    expect(response.body.price).toBe(30);
    expect(response.body.quantity).toBe(1);
  });

  it("❌ [Tests fonctionnels] Échec d'ajout (données manquantes) (POST /cart/add)", async () => {
    const response = await request(app).post("/cart/add").send({});
    expect(response.status).toBe(400);
  });

  it("✅ [Tests fonctionnels] Récupération des produits du panier (GET /cart)", async () => {
    await Cart.create({ productId: 2, name: "T-shirt", price: 20, quantity: 2 });

    const response = await request(app).get("/cart");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("T-shirt");
  });

  it("✅ [Tests fonctionnels] Mise à jour de la quantité d'un produit (PUT /cart/:productId)", async () => {
    const cartItem = await Cart.create({ productId: 3, name: "Chaussures", price: 50, quantity: 1 });

    const response = await request(app)
      .put(`/cart/${cartItem.productId}`)
      .send({ quantity: 5 });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(5);
  });

  it("✅ [Tests fonctionnels] Suppression d'un produit du panier (DELETE /cart/:id)", async () => {
    const cartItem = await Cart.create({ productId: 4, name: "Casquette", price: 15, quantity: 1 });

    const response = await request(app).delete(`/cart/${cartItem.id}`);
    expect(response.status).toBe(200);

    const checkItem = await Cart.findByPk(cartItem.id);
    expect(checkItem).toBeNull();
  });

  it("✅ [Tests fonctionnels] Vider le panier (DELETE /cart)", async () => {
    await Cart.create({ productId: 5, name: "Sac à dos", price: 40, quantity: 1 });
    await request(app).delete("/cart");

    const response = await request(app).get("/cart");
    expect(response.body.length).toBe(0);
  });

  // Tests d'utilisabilité
  it("🧪 [Tests d'utilisabilité] Vérification des messages d'erreur clairs", async () => {
    const response = await request(app).post("/cart/add").send({});
    expect(response.body.message).toBeDefined(); // Vérifie qu'un message d'erreur est présent
    expect(typeof response.body.message).toBe("string");
  });

  // Tests de compatibilité
  it("🌐 [Tests de compatibilité] Vérification de la compatibilité avec différents User-Agent", async () => {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Safari/604.1",
      "Mozilla/5.0 (Linux; Android 10; SM-G970F) Mobile Safari/537.36"
    ];

    for (const agent of userAgents) {
      const response = await request(app)
        .post("/cart/add")
        .set("User-Agent", agent)
        .send({ productId: 6, name: "Gants", price: 25, quantity: 2 });

      expect(response.status).toBe(201);
    }
  });

  // Tests de performance
  it("⚡ [Tests de performance] Test de charge avec 10 requêtes simultanées", async () => {
    const requests = Array.from({ length: 10 }, () =>
      request(app).post("/cart/add").send({ productId: 8, name: "Bouteille", price: 10, quantity: 1 })
    );
  
    const responses = await Promise.all(requests);
    responses.forEach(response => expect(response.status).toBe(201));
  });
  

  // Tests de sécurité
  it("🔐 [Tests de sécurité] Prévention des injections SQL", async () => {
    const response = await request(app)
      .post("/cart/add")
      .send({ productId: "1; DROP TABLE cart;", name: "Hack", price: 0, quantity: 1 });

    expect(response.status).toBe(400); // L'API doit rejeter cette tentative
  });
});