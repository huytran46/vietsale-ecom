import { number } from "yup/lib/locale";
import { District, Province, Ward } from "./Location";

type UserAddressEdges = {
  in_province: Province;
  in_district: District;
  in_ward: Ward;
};

export interface UserAddress {
  id: string;
  fullname: string;
  phone: string;
  address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  edges: UserAddressEdges;
}

export type AddAddressPayload = {
  fullname: string;
  phone: string;
  address: string;
  provinceID: number;
  districtID: number;
  wardID: number;
  isDefault: boolean;
};
