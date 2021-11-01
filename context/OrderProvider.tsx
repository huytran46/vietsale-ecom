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

  const totalShippingFee = React.useMemo(() => {
    const result = checkingoutItems.reduce((final, coi) => {
      final += isNaN(coi.totalShippingFee) ? 0 : coi.totalShippingFee;
      return final;
    }, 0);

    return result;
  }, [checkingoutItems]);

  const totalFinalPrice = React.useMemo(() => {
    const result = checkingoutItems.reduce((final, coi) => {
      final += isNaN(coi.totalFinalPrice) ? 0 : coi.totalFinalPrice;
      return final;
    }, 0);
    return result + totalShippingFee;
  }, [checkingoutItems, totalShippingFee]);

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
