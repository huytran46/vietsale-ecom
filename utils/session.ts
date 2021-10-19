// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
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
export type NextIronRequest = NextApiRequest & { session: Session };
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
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      // secure: process.env.NODE_ENV === "production",
    },
  });
}

export default withSession;
