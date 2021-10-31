import { AxiosResponse } from "axios";
import { CheckoutPayload } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import { Order } from "models/Order";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = "/user/cart/checkout";
    const payload: CheckoutPayload = await req.body;
    const result = await fetcher.post<
      CheckoutPayload,
      AxiosResponse<BaseReponse<{ orders: Order[] }>>
    >(uri, payload, {
      headers: {
        Authorization: "Bearer " + req.token,
      },
    });
    const orderInfo = result.data.data;
    if (orderInfo) return res.status(200).json(orderInfo);
    return res.status(404).json({ error: "Nothing's returned" });
  })
);
