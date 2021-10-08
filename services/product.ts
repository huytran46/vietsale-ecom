import { HttpQueryParam } from "models/common/SearchQuery";
import { Product } from "models/Product";
import { parseUrlWithQueries } from "utils/query";

export const FETCH_PRODUCT_URI = "/api/product";
export async function fetchProducts(
  param?: HttpQueryParam
): Promise<Product[]> {
  const url = parseUrlWithQueries(FETCH_PRODUCT_URI, param);
  const res = await fetch(url);
  return await res.json();
}

export const FETCH_PRODUCT_DETAIL_URI = "/api/product/";
export async function fetchProductDetail(productId: string): Promise<Product> {
  const url = parseUrlWithQueries(FETCH_PRODUCT_DETAIL_URI + productId);
  const res = await fetch(url);
  return await res.json();
}
