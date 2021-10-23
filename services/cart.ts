import axios from "axios";
import { HOST_URL } from "constants/platform";
import { Cart, CartInfo } from "models/Cart";
import {
  AddToCartPayload,
  RemoveFromCartPayload,
} from "models/request-response/Cart";

export const ADD_TO_CART_URI = "/api/cart/add";
export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
  try {
    const res = await fetch(HOST_URL + ADD_TO_CART_URI, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    return {} as Cart;
  }
}

export const REMOVE_FROM_CART_URI = "/api/cart/remove";
export async function removeFromCart(
  payload: RemoveFromCartPayload
): Promise<Cart> {
  try {
    const res = await fetch(HOST_URL + REMOVE_FROM_CART_URI, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    return {} as Cart;
  }
}

export const FETCH_CART_URI = "/api/cart";
export async function fetchCartInfo(): Promise<CartInfo> {
  try {
    const res = await axios.get<CartInfo>(HOST_URL + FETCH_CART_URI);
    return res.data;
  } catch (error) {
    return {} as CartInfo;
  }
}
