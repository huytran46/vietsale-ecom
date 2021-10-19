import { MyFile } from "./MyFile";
import { Product } from "./Product";

interface CartItemEdges {
  is_product: Product;
}

interface CartItem {
  id: string;
  qty: number;
  orig_price: number;
  created_at: string;
  updated_at: string;
  edges: CartItemEdges;
}

export interface CartInfo {
  cart: {
    total_items: number;
    total_price: number;
  };
  cart_item_groups: [
    {
      shop_id: string;
      shop_name: string;
      shop_avatar?: MyFile;
      cart_items: CartItem[];
    }
  ];
}

export interface Cart {
  id: string;
  total_item: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  edges: {
    items: CartItem[];
  };
}