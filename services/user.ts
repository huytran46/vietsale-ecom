import to from "await-to-js";
import axios from "axios";
import { HOST_URL } from "constants/platform";
import { UserAddress } from "models/UserAddress";

export const FETCH_DEFAULT_ADDRESS_URI = "/api/user/address";
export async function doFetchDefaultAddress(): Promise<UserAddress[]> {
  const [err, resp] = await to(
    axios.get<UserAddress[]>(HOST_URL + FETCH_DEFAULT_ADDRESS_URI, {
      withCredentials: true,
    })
  );
  if (err) {
    return [];
  }
  return resp?.data ?? [];
}
