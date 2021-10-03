import { HOST_URL } from "constants/platform";
import { LoginPayload } from "models/request-response/Login";
import { User } from "models/User";

export const LOGIN_URI = "/api/login";
export async function doLogin(payload: LoginPayload): Promise<User> {
  // fingerpring js
  const res = await fetch(HOST_URL + LOGIN_URI, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return await res.json();
}
