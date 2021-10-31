export type AddToCartPayload = {
  productID: string;
  qty: number;
};

export type RemoveFromCartPayload = {
  cartItemID: string;
  qty: number;
};

export type PreCheckoutResponse = {
  logistic_channels: [
    {
      shop_id: string;
      channels: [
        {
          channel_id: number;
          channel_name: string;
          service_code: string;
          services: {
            service_id: number;
            service_name: string;
            shipping_fee: number;
          }[];
        }
      ];
    }
  ];
};
