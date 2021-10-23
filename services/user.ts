import to from "await-to-js";
import { HOST_URL } from "constants/platform";
import { UserAddress } from "models/UserAddress";

export const FETCH_DEFAULT_ADDRESS_URI = "/api/user/address";
export async function doFetchDefaultAddress(): Promise<UserAddress[]> {
  const res = await fetch(HOST_URL + FETCH_DEFAULT_ADDRESS_URI);
  const [err, data] = await to(res.json());
  if (err) {
    return [];
  }
  return data;
}
