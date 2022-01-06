import axios from "axios";
import { stringifyUrl } from "query-string";

import { HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { BasePostResponse, BaseReponse } from "models/common/BaseResponse";
import { AddAddressPayload, UserAddress } from "models/UserAddress";
import { ApiError } from "models/common/ApiError";

export const FETCH_DEFAULT_ADDRESS_URI = "/user/address/get";
export async function doFetchDefaultAddress(
  token: string
): Promise<UserAddress[]> {
  return new Promise<UserAddress[]>((resolve, reject) => {
    if (!token) {
      reject("No token provided");
      return;
    }

    axios
      .get<BaseReponse<{ user_addresses: UserAddress[] }>>(
        HOST_URL_FOR_EXTERNAL_CALL + "/user/address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data?.data?.user_addresses ?? []);
      })
      .catch((err: ApiError) => reject(err.response?.data?.message));
  });
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

export const UPDATE_ADDRESS = "/user/address/put";
export function doUpdateAddress(
  token: string,
  address_id: string,
  payload: AddAddressPayload
): Promise<UserAddress> {
  return new Promise<UserAddress>((resolve, reject) => {
    axios
      .put<AddAddressPayload, BasePostResponse<{ user_address: UserAddress }>>(
        stringifyUrl({
          url: HOST_URL_FOR_EXTERNAL_CALL + "/user/address",
          query: { address_id },
        }),
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

export const DELETE_ADDRESS = "/user/address/delete";
export function doDeleteAddress(
  token: string,
  address_id: string
): Promise<UserAddress> {
  return new Promise<UserAddress>((resolve, reject) => {
    axios
      .delete<BaseReponse<{ user_address: UserAddress }>>(
        stringifyUrl({
          url: HOST_URL_FOR_EXTERNAL_CALL + "/user/address",
          query: { address_id },
        }),
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
