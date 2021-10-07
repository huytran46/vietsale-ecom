import { HOST_URL } from "constants/platform";
import { HomeInfo } from "models/request-response/Home";

export const FETCH_HOME_URI = "/api/public/home";
export async function fetchHome(): Promise<HomeInfo> {
  const res = await fetch(HOST_URL + FETCH_HOME_URI);
  return await res.json();
}
