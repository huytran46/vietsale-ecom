import { AxiosResponse } from "axios";
import { Cart } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

type AddToCartBody = {
  productID: string;
  qty: number;
};

export default withSession(
  withAuth(async (req, res) => {
    const payload: AddToCartBody = JSON.parse(req.body);
    if (!payload) return res.status(400).json({ error: "Bad request" });
    const uri = "/user/cart/item";
    const result = await fetcher.post<
      AddToCartBody,
      AxiosResponse<BaseReponse<{ cart: Cart }>>
    >(uri, payload, {
      headers: {
        Authorization: `Bearer ${req.token}`,
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
  })
);
