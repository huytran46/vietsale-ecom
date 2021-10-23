import { AxiosResponse } from "axios";
import { ErrorCode } from "constants/error";
import { IronSessionKey } from "constants/session";
import { Cart } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import { RemoveFromCartPayload } from "models/request-response/Cart";
import fetcher from "services/config";
import withSession from "utils/session";

type AddToCartBody = {
  productID: string;
  qty: number;
};

export default withSession(async (req, res) => {
  const token = req.session.get(IronSessionKey.AUTH);
  if (!token || token === "")
    return res.status(401).json({ error: "Unauthorized" });

  const payload: RemoveFromCartPayload = JSON.parse(req.body);
  if (!payload) return res.status(400).json({ error: "Bad request" });
  const uri = "/user/cart/item";
  try {
    const result = await fetcher.put<
      RemoveFromCartPayload,
      AxiosResponse<BaseReponse<{ cart: Cart }>>
    >(uri, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.status !== 200 && result.status !== 201) {
      return res.status(result.status).json({});
    }

    if (!result.data) {
      return res.status(500).json({});
    }

    const cartInfo = result.data.data.cart;
    if (cartInfo) return res.json(cartInfo);
    return res.status(500).json(0);
  } catch (error: any) {
    return res.status(500).json({});
  }
});
