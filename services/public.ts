import axios from "axios";
import { HOST_URL, HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { BaseReponse } from "models/common/BaseResponse";
import { ProductCategory } from "models/ProductCategory";
import { HomeInfo } from "models/request-response/Home";

export const FETCH_HOME_URI = "/api/public/home";
export async function fetchHome(): Promise<HomeInfo> {
  const res = await fetch(HOST_URL + FETCH_HOME_URI);
  return await res.json();
}

export const FETCH_CATEGORIES = "/public/product/category";
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await axios.get<
      BaseReponse<{ product_categories: ProductCategory[] }>
    >(HOST_URL_FOR_EXTERNAL_CALL + FETCH_CATEGORIES);
    return res.data?.data?.product_categories ?? [];
  } catch (error) {
    return [];
  }
}
