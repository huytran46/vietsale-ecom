export type ConfirmDeleteProductModalProps = {
  productName: string;
  params: {
    token: string;
    shopId: string;
    productId: string;
  };
  currentQueryKey: string[];
};
