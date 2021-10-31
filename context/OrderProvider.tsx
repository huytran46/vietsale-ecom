import React from "react";
import { CheckoutItemWithServiceAndPrices } from "models/Cart";

type OrderContext = {
  totalFinalPrice: number;
  totalShippingFee: number;
  checkingoutItems: CheckoutItemWithServiceAndPrices[];
  setCheckoutItems: React.Dispatch<
    React.SetStateAction<CheckoutItemWithServiceAndPrices[]>
  >;
};

const OrderContxt = React.createContext({} as OrderContext);

export const OrderProvider: React.FC = ({ children }) => {
  const [checkingoutItems, setCheckoutItems] = React.useState<
    CheckoutItemWithServiceAndPrices[]
  >([]);

  const totalFinalPrice = React.useMemo(
    () =>
      checkingoutItems.reduce((final, coi) => {
        final += coi.totalFinalPrice;
        return final;
      }, 0),
    [checkingoutItems]
  );

  const totalShippingFee = React.useMemo(
    () =>
      checkingoutItems.reduce((final, coi) => {
        final += coi.totalShippingFee;
        return final;
      }, 0),
    [checkingoutItems]
  );

  return (
    <OrderContxt.Provider
      value={{
        checkingoutItems,
        setCheckoutItems,
        totalFinalPrice,
        totalShippingFee,
      }}
    >
      {children}
    </OrderContxt.Provider>
  );
};

export const useOrderCtx = () => React.useContext(OrderContxt);
