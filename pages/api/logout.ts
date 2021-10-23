import { IronSessionKey } from "constants/session";
import fetcher from "services/config";
import withSession, { withAuth } from "utils/session";

export default withSession(
  withAuth(async (req, res) => {
    const uri = "/auth/logout";
    const refreshToken = req.session.get(IronSessionKey.REF_TOKEN);
    if (!refreshToken) return res.status(401).json({ success: false });
    await fetcher.post(
      uri,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      }
    );

    req.session.destroy();
    await req.session.save();
    res.statusCode = 200;
    res.end();
    return;
  })
);
