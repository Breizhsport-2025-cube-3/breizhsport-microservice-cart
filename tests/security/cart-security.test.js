import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import cartRoutes from "../../routes/cartRoutes.js";

// Serveur express de test
const app = express();
app.use(express.json());
app.use("/cart", cartRoutes);

describe("🔒 Tests de sécurité - Microservice Cart", () => {
  it("🚨 Doit refuser une injection SQL", async () => {
    const response = await request(app)
      .post("/cart/add")
      .send({ productId: "1; DROP TABLE cart;", name: "Hacker", price: 20 });

    expect(response.status).toBe(400); // On attend un rejet
  });

  it("🚨 Doit protéger contre une injection XSS", async () => {
    const response = await request(app)
      .post("/cart/add")
      .send({ productId: 1, name: "<script>alert('hacked');</script>", price: 20 });

    expect(response.status).toBe(400); // On attend un rejet
  });
});
