import { CartInfo } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import fetcher from "services/config";
import withSession from "utils/session";

type AddToCartBody = {
  productID: string;
  qty: number;
};

export default withSession(async (req, res) => {
  const payload: AddToCartBody = req.body;
  if (!payload) return res.status(400).json({ error: "Bad request" });
  const uri = "/user/cart/item";
  try {
    const result = await fetcher.post<BaseReponse<CartInfo>>(uri);

    if (!result.data) {
      return res.status(500).json({});
    }

    if (result.status !== 200) {
      return res.status(result.status).json({});
    }

    const cartInfo = result.data.data;
    if (cartInfo) return res.json(cartInfo);
    return res.status(500).json({ error: "Not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});
