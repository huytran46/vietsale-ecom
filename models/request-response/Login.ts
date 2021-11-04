import { User } from "models/User";

export type LoginPayload = {
  username: string;
  password: string;
  fcm: string;
  deviceModel: string;
};

export type LoginResponse = {
  email: string;
  token: {
    access_token: string;
    refresh_token: string;
    exp: number;
  };
  is_merchant: boolean;
};

export type RegisterPayload = {
  phone: string;
  email: string;
  password?: string;
  confirmed?: string;
  isRegisterForBusiness?: boolean;
  shopName?: string;
  shopAddress?: string;
};

export type RegisterResponse = {
  user: User;
};
