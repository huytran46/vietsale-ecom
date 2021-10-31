import { AxiosResponse } from "axios";
import { PreCheckoutPayload } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import { PreCheckoutResponse } from "models/request-response/Cart";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = "/user/cart/checkout/pre";
    const payload: PreCheckoutPayload = await req.body;

    const result = await fetcher.post<
      PreCheckoutPayload,
      AxiosResponse<BaseReponse<PreCheckoutResponse>>
    >(uri, payload, {
      headers: {
        Authorization: "Bearer " + req.token,
      },
    });
    const cartInfo = result.data.data;
    if (cartInfo) return res.status(200).json(cartInfo);
    return res.status(404).json({ error: "Nothing's returned" });
  })
);
