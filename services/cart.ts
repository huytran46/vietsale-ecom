import { HOST_URL } from "constants/platform";
import { Cart } from "models/Cart";
import { AddToCartPayload } from "models/request-response/Cart";

export const ADD_TO_CART_URI = "/api/cart/add";
export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
  const res = await fetch(HOST_URL + ADD_TO_CART_URI, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return await res.json();
}
