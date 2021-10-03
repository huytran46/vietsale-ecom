import { Ward } from './Location';

export type Inventory = {
  id: string;
  fullname: string;
  phone: string;
  address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  edges?: InventoryEdge;
};

export type InventoryEdge = {
  ward: Ward;
};
