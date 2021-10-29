// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import to from "await-to-js";
import { IronSessionKey } from "constants/session";
import {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { Session, withIronSession } from "next-iron-session";

type MyResponse = GetServerSidePropsResult<unknown> &
  Partial<{ noLayout?: boolean }>;

// optionally add stronger typing for next-specific implementation
export type NextIronRequest = NextApiRequest & {
  session: Session;
  token?: string;
};
export type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse
) => void | Promise<void>;

export type NextSsrIronHandler = (
  context: GetServerSidePropsContext & { req: { session: Session } }
) => MyResponse | Promise<MyResponse>;

function withSession(handler: NextIronHandler | NextSsrIronHandler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD ?? "",
    cookieName: "vietsale/ecommerce",
    cookieOptions: {
      // httpOnly: true,
      // sameSite: "lax",
      // path: "/",
      // secure: process.env.NODE_ENV === "production",
      secure: false,
    },
  });
}

export function withAuth(
  handler: NextIronHandler,
  fallBackPath?: string,
  forceLogin?: boolean
): NextIronHandler {
  return async (req, res) => {
    const token = req.session.get(IronSessionKey.AUTH);
    console.log("token in withAuth: ", token);
    if (!token) {
      req.session.destroy();
      await req.session.save();
      res.status(401);
      res.end();
      return;
    }
    req.token = token;
    try {
      await handler(req, res);
    } catch (error: any) {
      if (error?.response?.status) {
        if (error?.response?.status === 401 && Boolean(forceLogin)) {
          req.session.destroy();
          await req.session.save();
          res.setHeader("location", fallBackPath ?? "/login");
          res.statusCode = 302;
          res.end();
          return;
        }

        if (error?.response?.status === 401) {
          req.session.destroy();
          await req.session.save();
          res.setHeader("location", "/");
          res.statusCode = 302;
          res.end();
          return;
        }
      }

      res.status(500);
      res.end();
      return;
    }
  };
}

export default withSession;
