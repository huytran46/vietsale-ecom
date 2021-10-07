import { Product } from "models/Product";
import { ProductCategory } from "models/ProductCategory";

export type HomeInfo = {
  banners: Product[];
  highlight_products: Product[];
  hot_deals: Product[];
  discount_products?: Product[];
  product_categories: ProductCategory[];
};
