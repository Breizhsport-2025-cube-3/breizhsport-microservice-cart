import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  stages: [
    { duration: "5s", target: 50 }, // Monte à 50 utilisateurs en 5 sec
    { duration: "20s", target: 50 }, // Maintien la charge
    { duration: "5s", target: 0 }, // Descend à 0
  ],
};

export default function () {
  let res = http.post("http://localhost:3000/cart/add", JSON.stringify({
    productId: 1, name: "Test", price: 10, quantity: 1
  }), {
    headers: { "Content-Type": "application/json" },
  });

  check(res, { "Statut 201 reçu": (r) => r.status === 201 });
  sleep(1);
}
