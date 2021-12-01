import axios from "axios";
import { LocalStorageKey } from "constants/local-storage";
import { HOST_URL, HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { ApiError } from "models/common/ApiError";
import { BaseReponse } from "models/common/BaseResponse";
import { District, Province, Ward } from "models/Location";
import { ProductCategory } from "models/ProductCategory";
import { HomeInfo } from "models/request-response/Home";
import { stringifyUrl } from "query-string";
import { lsTimeToLive } from "utils/local-storage";

export const FETCH_HOME_URI = "/api/public/home";
export async function fetchHome(): Promise<HomeInfo> {
  const res = await fetch(HOST_URL + FETCH_HOME_URI);
  return await res.json();
}

// export const FETCH_CATEGORIES = "/public/product/category";
// export async function fetchProductCategories(): Promise<ProductCategory[]> {
//   try {
//     const res = await axios.get<
//       BaseReponse<{ product_categories: ProductCategory[] }>
//     >(HOST_URL_FOR_EXTERNAL_CALL + FETCH_CATEGORIES);
//     return res.data?.data?.product_categories ?? [];
//   } catch (error) {
//     return [];
//   }
// }
export const FETCH_CATEGORIES = "/public/product/category";
export function fetchProductCategories(): Promise<ProductCategory[]> {
  return new Promise<ProductCategory[]>((resolve, reject) => {
    const cached = lsTimeToLive.get(LocalStorageKey.CATEGORIES);
    if (cached) {
      resolve(JSON.parse(cached) as ProductCategory[]);
    } else {
      axios
        .get<BaseReponse<{ product_categories: ProductCategory[] }>>(
          HOST_URL_FOR_EXTERNAL_CALL + FETCH_CATEGORIES
        )
        .then((res) => {
          const data = res.data.data?.product_categories ?? [];
          lsTimeToLive.set(
            LocalStorageKey.CATEGORIES,
            JSON.stringify(data),
            1000 * 60 * 60 * 60 * 24 * 7 // a week
          );
          resolve(data);
        })
        .catch((err: ApiError) => {
          reject(
            err.response?.data?.message ??
              "Đã xảy ra lỗi [/home/productcategory]"
          );
        });
    }
  });
}

export const FETCH_PROVINCES = "/public/province";
export function fetchProvinces(): Promise<Province[]> {
  return new Promise<Province[]>((resolve, reject) => {
    const cached = lsTimeToLive.get(LocalStorageKey.PROVINCES);
    if (cached) {
      resolve(JSON.parse(cached) as Province[]);
    } else {
      axios
        .get<BaseReponse<{ provinces: Province[] }>>(
          HOST_URL_FOR_EXTERNAL_CALL + FETCH_PROVINCES
        )
        .then((res) => {
          const data = res.data.data?.provinces ?? [];
          lsTimeToLive.set(
            LocalStorageKey.PROVINCES,
            JSON.stringify(data),
            1000 * 60 * 60 * 60 * 24 * 366 * 10 // 10 years :)
          );
          resolve(data);
        })
        .catch((err: ApiError) => {
          reject(
            err.response?.data?.message ?? "Đã xảy ra lỗi [/vs/provinces]"
          );
        });
    }
  });
}

export const FETCH_DISTRICTS = "/public/district";
export function fetchDistricts(query?: {
  province_id: number;
}): Promise<District[]> {
  return new Promise<District[]>((resolve, reject) => {
    axios
      .get<BaseReponse<{ districts: District[] }>>(
        stringifyUrl({
          url: HOST_URL_FOR_EXTERNAL_CALL + FETCH_DISTRICTS,
          query: { ...query },
        })
      )
      .then((res) => {
        const data = res.data.data?.districts ?? [];
        resolve(data);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? "Đã xảy ra lỗi [/vs/districts]");
      });
  });
}

export const FETCH_WARDS = "/public/ward";
export function fetchWards(query?: { district_id: number }): Promise<Ward[]> {
  return new Promise<Ward[]>((resolve, reject) => {
    axios
      .get<BaseReponse<{ wards: Ward[] }>>(
        stringifyUrl({
          url: HOST_URL_FOR_EXTERNAL_CALL + FETCH_WARDS,
          query: { ...query },
        })
      )
      .then((res) => {
        const data = res.data.data?.wards ?? [];
        resolve(data);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? "Đã xảy ra lỗi [/vs/wards]");
      });
  });
}
