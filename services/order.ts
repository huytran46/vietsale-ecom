import axios, { AxiosResponse } from "axios";
import to from "await-to-js";
import { HOST_URL } from "constants/platform";
import { CheckoutPayload, PreCheckoutPayload } from "models/Cart";
import { PreCheckoutResponse } from "models/request-response/Cart";
import { Order, OrderStatus } from "models/Order";
import { stringifyUrl } from "query-string";

export const POST_PRECHECKOUT_URI = "/api/order/pre";
export async function postPrecheckout(
  payload: PreCheckoutPayload
): Promise<PreCheckoutResponse> {
  try {
    const [err, res] = await to(
      axios.post<PreCheckoutPayload, AxiosResponse<PreCheckoutResponse>>(
        HOST_URL + POST_PRECHECKOUT_URI,
        payload
      )
    );

    if (err || !res) return {} as PreCheckoutResponse;
    return res.data;
  } catch (error) {
    return {} as PreCheckoutResponse;
  }
}

export const POST_CHECKOUT_URI = "/api/order/checkout";
export async function postCheckout(payload: CheckoutPayload): Promise<Order[]> {
  try {
    const [err, res] = await to(
      axios.post<PreCheckoutPayload, AxiosResponse<{ orders: Order[] }>>(
        HOST_URL + POST_CHECKOUT_URI,
        payload
      )
    );

    if (err || !res) return [];
    return res.data.orders;
  } catch (error) {
    return [];
  }
}

export const FETCH_ORDERS_URI = "/api/order";
export async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  try {
    const [err, res] = await to(
      axios.get<Order[]>(
        stringifyUrl({ url: HOST_URL + FETCH_ORDERS_URI, query: { status } })
      )
    );
    if (err || !res) return [];
    return res.data;
  } catch (error) {
    return [];
  }
}
