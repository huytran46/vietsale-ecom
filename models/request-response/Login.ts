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
