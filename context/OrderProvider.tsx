import React from "react";
import { CheckoutItemWithServiceAndPrices } from "models/Cart";
import { OrderGroup } from "components/Order/OrderGroup";
import { Order } from "models/Order";

type OrderContext = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  orderGroups: OrderGroup[];
  setOrderGroups: React.Dispatch<React.SetStateAction<OrderGroup[]>>;
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

  const [orderGroups, setOrderGroups] = React.useState<OrderGroup[]>([]);

  const [orders, setOrders] = React.useState<Order[]>([]);

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
        orders,
        setOrders,
        orderGroups,
        setOrderGroups,
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
