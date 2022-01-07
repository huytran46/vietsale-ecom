import { Product } from "models/Product";
import { ProductCategory } from "models/ProductCategory";

type Banner = {
  imgSrc?: string;
  ctaUrl?: string;
};

export type HomeInfo = {
  banners: Banner[];
  highlight_products: Product[];
  hot_deals: Product[];
  discount_products?: Product[];
  product_categories: ProductCategory[];
};
