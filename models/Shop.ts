import { Inventory } from "./Inventory";
import { MyFile } from "./MyFile";
import { Product } from "./Product";
import { Uom } from "./Uom";
import { User } from "./User";

export type Shop = {
  id: string;
  shop_name: string;
  shop_address: string;
  email: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  edges: ShopEdge;
};

export type ShopEdge = {
  owner: User;
  inventories: Inventory[];
  files: MyFile[];
  products: Product[];
  avatar: MyFile;
  unitOfMeasures: Uom[];
};
