import axios from "axios";

import { HOST_URL_FOR_EXTERNAL_CALL } from "constants/platform";
import { ApiError } from "models/common/ApiError";
import { Shop } from "models/Shop";
import { BaseReponse } from "models/common/BaseResponse";
import { ProductCategory } from "models/ProductCategory";
import { Product } from "models/Product";
import { stringifyUrl } from "query-string";
import { HttpQueryParam } from "models/common/SearchQuery";

export const FETCH_SHOP_DETAIL = "/public/shop/detail";
export function fetchShopDetail(shopId: string): Promise<Shop> {
  return new Promise<Shop>((resolve, reject) => {
    axios
      .get<BaseReponse<{ shop: Shop }>>(
        HOST_URL_FOR_EXTERNAL_CALL + "/public/shop/" + shopId
      )
      .then((res) => {
        resolve(res.data?.data?.shop);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? new Error("unknown error"));
      });
  });
}

export const FETCH_SHOP_CATEGORIES = "/public/shop/categories";
export function fetchShopCategories(
  shopId: string
): Promise<ProductCategory[]> {
  return new Promise<ProductCategory[]>((resolve, reject) => {
    axios
      .get<BaseReponse<{ product_categories: ProductCategory[] }>>(
        HOST_URL_FOR_EXTERNAL_CALL +
          "/public/shop/" +
          shopId +
          "/product/category"
      )
      .then((res) => {
        resolve(res.data?.data?.product_categories ?? []);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? new Error("unknown error"));
      });
  });
}

export const FETCH_SHOP_PRODUCTS = "/public/shop/products";
export function fetchShopProducts(
  shopId: string,
  query?: HttpQueryParam
): Promise<Product[]> {
  return new Promise<Product[]>((resolve, reject) => {
    axios
      .get<BaseReponse<{ products: Product[] }>>(
        stringifyUrl(
          {
            url:
              HOST_URL_FOR_EXTERNAL_CALL +
              "/public/shop/" +
              shopId +
              "/product",
            query,
          },
          {
            skipEmptyString: true,
            skipNull: true,
          }
        )
      )
      .then((res) => {
        resolve(res.data?.data?.products ?? []);
      })
      .catch((err: ApiError) => {
        reject(err.response?.data?.message ?? new Error("unknown error"));
      });
  });
}
