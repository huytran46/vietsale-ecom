import { CartInfo } from "models/Cart";
import React from "react";

type CartContext = {
  updateCartItem: (productId: string, qty: number) => void;
  numberOfItems: number;
};

const CartCtx = React.createContext({} as CartContext);

export const CartProvider: React.FC = ({ children }) => {
  const [cartInfo, setCartInfo] = React.useState<CartInfo>();
  const numberOfItems = React.useMemo(
    () => cartInfo?.cart.total_items ?? 0,
    [cartInfo]
  );
  const updateCartItem = React.useCallback(
    (productId: string, qty: number) => {},
    []
  );
  return (
    <CartCtx.Provider value={{ updateCartItem, numberOfItems }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCartCtx = () => React.useContext(CartCtx);
