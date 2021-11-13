import { BaseReponse } from "models/common/BaseResponse";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = "/merchant/shop";
    const result = await fetcher.get(uri, {
      headers: {
        Authorization: "Bearer " + req.token,
      },
    });
    const cartInfo = result.data;
    if (cartInfo) return res.status(200).json(cartInfo);
    return res.status(404).json({ error: "Nothing's returned" });
  })
);
