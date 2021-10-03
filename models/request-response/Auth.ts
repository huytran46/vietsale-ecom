export type AuthReponse = {
  email?: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
  is_merchant: boolean;
  is_admin: boolean;
};

export type LoginRequest = {
  phone?: string;
  email?: string;
  fcm?: string;
  password: string;
  deviceModel?: string;
};

export type RefreshSessionRequest = {
  refreshToken: string;
};

export type RefreshSessionResponse = {
  access_token: string;
};

export type LogoutRequest = {
  refreshToken: string;
  accessToken: string;
};
