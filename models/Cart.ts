import { MyFile } from "./MyFile";
import { Product } from "./Product";

interface CartItemEdges {
  is_product: Product;
}

interface CartItem {
  id: "b47c04b9-c876-43a7-a6c0-0bbc69db7b79";
  qty: 1;
  orig_price: 4000000;
  created_at: "2021-09-16T17:03:33.741567+07:00";
  updated_at: "2021-09-16T17:03:33.741568+07:00";
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
