import { AxiosError, AxiosResponse } from "axios";
import nc from "next-connect";
import cors from "cors";

import { BaseReponse } from "models/common/BaseResponse";
import {
  RegisterPayload,
  RegisterResponse,
} from "models/request-response/Login";
import fetcher from "services/config";
import withSession from "utils/session";

export default nc()
  .use(cors())
  .post(
    withSession(async (req, res) => {
      try {
        const uri = "/public/user/register";
        const payload: RegisterPayload = JSON.parse(req.body);
        const registerResp = await fetcher.post<
          any,
          AxiosResponse<BaseReponse<RegisterResponse>>
        >(uri, payload);
        if (!registerResp.data) {
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        const newUserInfo = registerResp.data.data.user;
        res.status(200).json(newUserInfo);
        return;
      } catch (error: any) {
        const errRes = error.response;
        if (errRes) {
          res.status(errRes.status);
          if (errRes.status === 409) {
            res.json({
              httpCode: errRes.status,
              message: "Email hoặc mật khẩu đã được sử dụng",
            });
          }
          res.end();
          return;
        }

        res.status(400).json({ error });
        return;
      }
    })
  );
