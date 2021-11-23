import React from "react";
import { useToast } from "@chakra-ui/toast";
import _isEmpty from "lodash/isEmpty";

import { CartInfo } from "models/Cart";
import { useMutation, useQueryClient } from "react-query";
import {
  addToCart,
  ADD_TO_CART_URI,
  removeFromCart,
  REMOVE_FROM_CART_URI,
  FETCH_CART_URI,
} from "services/cart";
import { ErrorCode, ErrorMap } from "constants/error";
import { useUser } from "./UserProvider";
type CartContext = {
  updateCartItem: (productId: string, qty: number) => void;
  removeCartItem: (cartItemId: string, qty: number) => void;
  numberOfItems: number;
  setCartInfo: (next: CartInfo) => void;
  selectedCartItems?: Record<string, string[]>;
  selectCartItems: (shopId: string, cartItems: string[]) => void;
};

const CartCtx = React.createContext({} as CartContext);

export const CartProvider: React.FC = ({ children }) => {
  const queryClient = useQueryClient();
  const {} = useUser();
  const toast = useToast();
  const { mutate: addToTheCart } = useMutation({
    mutationKey: ADD_TO_CART_URI,
    mutationFn: addToCart,
  });

  const { mutate: removeFromTheCart } = useMutation({
    mutationKey: REMOVE_FROM_CART_URI,
    mutationFn: removeFromCart,
  });

  const [cartInfo, setCartInfo] = React.useState<CartInfo>();
  const [selectedCartItems, setSelCartItems] =
    React.useState<Record<string, string[]>>();

  const numberOfItems = React.useMemo(
    () => cartInfo?.cart?.total_items ?? 0,
    [cartInfo]
  );

  const updateCartItem = React.useCallback(
    (productId: string, qty: number) => {
      addToTheCart(
        { productID: productId, qty },
        {
          onSuccess(data) {
            if (_isEmpty(data)) {
              toast({
                title: ErrorMap[ErrorCode._0],
                status: "error",
                // variant: "top-accent",
                duration: 1000,
                isClosable: true,
              });
              return;
            }
            const curr = { ...cartInfo };
            const next: CartInfo = {
              cart: {
                total_items: data.total_item,
                total_price: data.total_price,
              },
              cart_item_groups: curr.cart_item_groups ?? [],
            };
            setCartInfo(next);
            queryClient.invalidateQueries(FETCH_CART_URI);
            toast({
              title: "Cập nhật giỏ hàng thành công",
              status: "success",
              // variant: "top-accent",
              duration: 1000,
              isClosable: true,
            });
          },
          onError(error) {
            console.log("error:", error);
          },
        }
      );
    },
    [cartInfo, queryClient, addToTheCart, toast]
  );

  const removeCartItem = React.useCallback(
    (cartItemId: string, qty: number) => {
      removeFromTheCart(
        { cartItemID: cartItemId, qty: qty },
        {
          onSuccess(data) {
            if (_isEmpty(data)) {
              toast({
                title: ErrorMap[ErrorCode._0],
                status: "error",
                // variant: "top-accent",
                duration: 1000,
                isClosable: true,
              });
              return;
            }
            const curr = { ...cartInfo };
            const next: CartInfo = {
              cart: {
                total_items: data.total_item,
                total_price: data.total_price,
              },
              cart_item_groups: curr.cart_item_groups ?? [],
            };
            setCartInfo(next);
            queryClient.invalidateQueries(FETCH_CART_URI);
            toast({
              title: "Cập nhật giỏ hàng thành công",
              status: "success",
              // variant: "top-accent",
              duration: 1000,
              isClosable: true,
            });
          },
          onError(error) {
            console.log("error:", error);
          },
        }
      );
    },
    [cartInfo, queryClient, removeFromTheCart, toast]
  );

  const selectCartItems = React.useCallback(
    (shopId: string, cartItems: string[]) => {
      const next = { ...selectedCartItems };
      next[shopId] = cartItems;
      setSelCartItems(next);
    },
    [selectedCartItems, setSelCartItems]
  );

  return (
    <CartCtx.Provider
      value={{
        updateCartItem,
        removeCartItem,
        numberOfItems,
        setCartInfo,
        selectedCartItems,
        selectCartItems,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
};

export const useCartCtx = () => React.useContext(CartCtx);
