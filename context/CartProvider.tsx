import { CartInfo } from "models/Cart";
import React from "react";
import { useMutation } from "react-query";
import { addToCart, ADD_TO_CART_URI } from "services/cart";

type CartContext = {
  updateCartItem: (productId: string, qty: number) => void;
  numberOfItems: number;
};

const CartCtx = React.createContext({} as CartContext);

export const CartProvider: React.FC = ({ children }) => {
  const { mutate: addToTheCart } = useMutation({
    mutationKey: ADD_TO_CART_URI,
    mutationFn: addToCart,
  });

  const [cartInfo, setCartInfo] = React.useState<CartInfo>();
  const numberOfItems = React.useMemo(() => {
    console.log("cartInfo:", cartInfo);
    return cartInfo?.cart.total_items ?? 0;
  }, [cartInfo]);
  const updateCartItem = React.useCallback((productId: string, qty: number) => {
    addToTheCart(
      { productID: productId, qty },
      {
        onSuccess({ total_item, total_price }) {
          console.log(total_item);
          setCartInfo({
            cart: {
              total_items: total_item,
              total_price: total_price,
            },
            cart_item_groups: [{} as any],
          });
        },
      }
    );
  }, []);
  return (
    <CartCtx.Provider value={{ updateCartItem, numberOfItems }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCartCtx = () => React.useContext(CartCtx);
