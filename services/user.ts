import to from "await-to-js";
import axios from "axios";
import { HOST_URL, HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { ApiError } from "models/common/ApiError";
import { BasePostResponse } from "models/common/BaseResponse";
import { AddAddressPayload, UserAddress } from "models/UserAddress";

export const FETCH_DEFAULT_ADDRESS_URI = "/api/user/address";
export async function doFetchDefaultAddress(): Promise<UserAddress[]> {
  const [err, resp] = await to(
    axios.get<UserAddress[]>(HOST_URL + FETCH_DEFAULT_ADDRESS_URI)
  );
  if (err) {
    return [];
  }
  return resp?.data ?? [];
}

export const ADD_ADDRESS = "/user/address";
export function doAddAddress(
  token: string,
  payload: AddAddressPayload
): Promise<UserAddress> {
  return new Promise<UserAddress>((resolve, reject) => {
    axios
      .post<AddAddressPayload, BasePostResponse<{ user_address: UserAddress }>>(
        HOST_URL_FOR_EXTERNAL_CALL + ADD_ADDRESS,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data?.data?.user_address);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? "Đã xảy ra lỗi [/vs/wards]");
      });
  });
}
