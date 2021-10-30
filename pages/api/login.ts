import { AxiosResponse } from "axios";
import nc from "next-connect";
import cors from "cors";

import { IronSessionKey } from "constants/session";
import { BaseReponse } from "models/common/BaseResponse";
import { LoginPayload, LoginResponse } from "models/request-response/Login";
import fetcher from "services/config";
import withSession from "utils/session";

export default nc()
  .use(cors())
  .post(
    withSession(async (req, res) => {
      try {
        const uri = "/auth/user/login";
        const { username, password, deviceModel, fcm }: LoginPayload =
          JSON.parse(req.body);
        let isPhone = true;
        const splits = username.split("@");
        if (splits.length > 1) {
          isPhone = false;
        }

        let params;
        if (isPhone) {
          params = { phone: username, password, fcm, deviceModel };
        } else {
          params = { email: username, password, fcm, deviceModel };
        }

        const loginResp = await fetcher.post<
          any,
          AxiosResponse<BaseReponse<LoginResponse>>
        >(uri, params);

        if (!loginResp.data) {
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const token = loginResp.data.data.token.access_token;
        const refToken = loginResp.data.data.token.refresh_token;

        req.session.set(IronSessionKey.AUTH, token);
        req.session.set(IronSessionKey.REF_TOKEN, refToken);
        await req.session.save();

        console.log("req.session:", req.session.get(IronSessionKey.AUTH));
        res
          .status(200)
          .json({ success: true, email: loginResp.data.data.email });
        return;
      } catch (error) {
        res.status(500).json({ error });
        return;
      }
    })
  );
