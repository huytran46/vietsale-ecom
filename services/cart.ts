import axios from "axios";
import { HOST_URL, HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { Cart, CartInfo } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import {
  AddToCartPayload,
  RemoveFromCartPayload,
} from "models/request-response/Cart";
import { configHeader } from "utils";

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

export const FETCH_CART_URI = "/user/cart";
export async function fetchCartInfo(token: string): Promise<CartInfo> {
  try {
    const res = await axios.get<BaseReponse<CartInfo>>(
      HOST_URL_FOR_EXTERNAL_CALL + FETCH_CART_URI,
      configHeader(token)
    );
    if (!res.data) return {} as any;
    return res.data.data;
  } catch (error) {
    return {} as CartInfo;
  }
}
