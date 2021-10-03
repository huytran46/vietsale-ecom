import { IronSessionKey } from "constants/session";
import { LoginPayload } from "models/request-response/Login";
import fetcher from "services/config";
import withSession from "utils/session";

export default withSession(async (req, res) => {
  const { username, password, deviceModel, fcm }: LoginPayload = await req.body;
  let isPhone = true;
  const splits = username.split("@");
  if (splits.length > 1) {
    isPhone = false;
  }
  fetcher.post("/api/v1/auth/user/login", {
    phone: isPhone ? username : "",
    email: !isPhone ? username : "",
    password,
    deviceModel,
    fcm,
  });
  try {
    req.session.set(IronSessionKey.AUTH, "");
    await req.session.save();
    res.json({});
  } catch (error) {
    console.log("err:", error);
    res.status(500).json({});
  }
});
