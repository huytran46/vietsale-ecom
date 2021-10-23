export type AddToCartPayload = {
  productID: string;
  qty: number;
};

export type RemoveFromCartPayload = {
  cartItemID: string;
  qty: number;
};
