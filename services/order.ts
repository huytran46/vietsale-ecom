import axios, { AxiosResponse } from "axios";
import to from "await-to-js";
import { HOST_URL } from "constants/platform";
import { PreCheckoutPayload } from "models/Cart";
import { PreCheckoutResponse } from "models/request-response/Cart";

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
