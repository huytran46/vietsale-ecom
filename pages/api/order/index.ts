import { BaseReponse } from "models/common/BaseResponse";
import { Order } from "models/Order";
import { stringifyUrl } from "query-string";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = stringifyUrl({ url: "/user/order", query: req.query });
    const result = await fetcher.get<BaseReponse<{ orders: Order[] }>>(uri, {
      headers: {
        Authorization: "Bearer " + req.token,
      },
    });
    if (!result.data) {
      return res.status(500).json({});
    }
    const orders = result?.data?.data?.orders;
    if (orders) return res.json(orders);
    return res.status(404).json({ error: "Not found" });
  })
);
