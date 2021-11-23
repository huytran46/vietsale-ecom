import axios, { AxiosResponse } from "axios";
import to from "await-to-js";
import { HOST_URL, HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { CheckoutPayload, PreCheckoutPayload } from "models/Cart";
import { PreCheckoutResponse } from "models/request-response/Cart";
import { Order, OrderStatus } from "models/Order";
import { stringifyUrl } from "query-string";
import { BaseReponse } from "models/common/BaseResponse";

const config = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const POST_PRECHECKOUT_URI = "/user/cart/checkout/pre";
export async function postPrecheckout(
  token: string,
  payload: PreCheckoutPayload
): Promise<PreCheckoutResponse> {
  try {
    const [err, res] = await to(
      axios.post<
        PreCheckoutPayload,
        AxiosResponse<BaseReponse<PreCheckoutResponse>>
      >(
        HOST_URL_FOR_EXTERNAL_CALL + POST_PRECHECKOUT_URI,
        payload,
        config(token)
      )
    );

    if (err || !res || !res.data) return {} as PreCheckoutResponse;
    return res.data.data;
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
