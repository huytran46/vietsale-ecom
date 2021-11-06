import { BaseReponse } from "models/common/BaseResponse";
import { UserAddress } from "models/UserAddress";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = "/user/address";
    const result = await fetcher.get<
      BaseReponse<{ user_addresses: UserAddress[] }>
    >(uri, {
      headers: {
        Authorization: "Bearer " + req.token,
      },
    });
    const userAddresses = result.data.data.user_addresses;
    if (userAddresses) return res.status(200).json(userAddresses);
    return res.status(404).json({ error: "Nothing's returned" });
  }, "/")
);
