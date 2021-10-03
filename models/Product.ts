import { MyFile } from './MyFile';
import { ProductCategory } from './ProductCategory';
import { Shop } from './Shop';
import { UomValue } from './Uom';

export type Product = {
  id: string;
  name: string;
  sku: string;
  desc: string;
  short_desc: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  orig_price: number;
  discount_value: number;
  discount_price: number;
  quantity: number;
  sales_volume: number;
  is_approved?: boolean;
  is_blocked?: boolean;
  is_deleted?: boolean;
  viettel_post_activated: boolean;
  created_at: string;
  updated_at: string;
  edges?: ProductEdge;
};

export type ProductEdge = {
  cover?: MyFile;
  files?: MyFile[];
  owner?: Shop;
  categories?: ProductCategory[];
  uom_using?: UomValue;
};
