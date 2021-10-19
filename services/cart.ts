import { HOST_URL } from "constants/platform";
import { CartInfo } from "models/Cart";

export const ADD_TO_CART_URI = "/api/cart/add";
export async function addToCart(): Promise<CartInfo> {
  const res = await fetch(HOST_URL + ADD_TO_CART_URI);
  return await res.json();
}
