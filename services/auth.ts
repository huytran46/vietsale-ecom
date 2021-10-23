import { HOST_URL } from "constants/platform";
import { LoginPayload } from "models/request-response/Login";
import { User } from "models/User";

export const LOGIN_URI = "/api/login";
export async function doLogin(payload: LoginPayload): Promise<User> {
  const res = await fetch(HOST_URL + LOGIN_URI, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export const LOGOUT_URI = "/api/logout";
export async function doLogout(): Promise<void> {
  const res = await fetch(HOST_URL + LOGOUT_URI, {
    method: "POST",
  });
  return await res.json();
}
