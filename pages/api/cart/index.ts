import { IronSessionKey } from "constants/session";
import { CartInfo } from "models/Cart";
import { BaseReponse } from "models/common/BaseResponse";
import fetcher from "services/config";
import withSession from "utils/session";

export default withSession(async (req, res) => {
  const token = req.session.get(IronSessionKey.AUTH);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const uri = "/user/cart";
  try {
    const result = await fetcher.get<BaseReponse<CartInfo>>(uri, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const cartInfo = result.data.data;
    if (cartInfo) return res.status(200).json(cartInfo);
    return res.status(404).json({ error: "Nothing's returned" });
  } catch (error: any) {
    if (error === 401) {
      req.session.destroy();
      await req.session.save();
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();
      return;
    }
    return res.status(500).json({ error: error.response.data });
  }
});
