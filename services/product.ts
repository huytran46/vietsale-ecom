import { HttpQueryParam } from "models/common/SearchQuery";
import { Product } from "models/Product";
import { urlWithQuery } from "utils/query";

export const FETCH_PRODUCT_URI = "/api/product";
export async function fetchProducts(
  param?: HttpQueryParam
): Promise<Product[]> {
  const url = urlWithQuery(FETCH_PRODUCT_URI, param);
  const res = await fetch(url);
  return await res.json();
}
