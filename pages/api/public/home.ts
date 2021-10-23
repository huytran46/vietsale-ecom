import { BaseReponse } from "models/common/BaseResponse";
import { HomeInfo } from "models/request-response/Home";
import fetcher from "services/config";
import withSession from "utils/session";

export default withSession(async (req, res) => {
  try {
    const result = await fetcher.get<BaseReponse<HomeInfo>>("/public/home");
    if (result?.status !== 200) {
      return res.status(result.status).json({});
    }

    const serverRes = result?.data;
    if (serverRes?.data) return res.json(serverRes.data);
    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.log("[public/home] error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
