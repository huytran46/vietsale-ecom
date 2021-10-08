import { Shop } from "./Shop";

export interface UserEdges {
  has_roles: any[];
  shops: Shop[];
}

export interface User {
  id?: string;
  phone?: string;
  email?: string;
  password?: string;
  is_merchant?: boolean;
  is_blocked?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  edges?: UserEdges;
}
