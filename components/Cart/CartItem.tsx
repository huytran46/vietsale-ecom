import React from "react";
import {
  HStack,
  Text,
  Checkbox,
  Image,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  Button,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";

import { formatCcy } from "utils";
import { CartItem } from "models/Cart";
import { useCartCtx } from "context/CartProvider";
import MyLinkOverlay from "components/common/MyLinkOverlay";

const MINIMUM_QTY = 0;

type Props = {
  cartItem: CartItem;
  isSelected?: boolean;
  rounded?: boolean;
};

const CartItemRow: React.FC<Props> = ({ cartItem, isSelected, rounded }) => {
  const [qty, setQty] = React.useState(cartItem.qty);
  const [isDeleting, setDeleting] = React.useState(cartItem.qty === 0);
  const { updateCartItem, removeCartItem } = useCartCtx();
  const product = React.useMemo(() => cartItem.edges?.is_product, [cartItem]);
  const productCover = React.useMemo(
    () => product.edges?.cover?.file_thumbnail,
    [product]
  );
  const productPrice = React.useMemo(
    () => product.discount_price ?? product.orig_price,
    [product]
  );

  const maxStock = React.useMemo(() => product.quantity ?? 0, [product]);

  const updateQty = React.useCallback(() => {
    if (!product) return;
    const nextQty = qty - cartItem.qty;
    if (nextQty < 0) removeCartItem(cartItem.id, Math.abs(nextQty));
    else updateCartItem(product.id, nextQty);
  }, [product, qty, updateCartItem, removeCartItem, cartItem]);

  React.useEffect(() => {
    if (qty !== 0) return;
    if (qty > maxStock) return;
    setDeleting(true);
  }, [qty, maxStock]);

  function onDelete() {
    updateQty();
  }

  function onNoDelete() {
    setDeleting(false);
    setQty(cartItem.qty);
  }

  return (
    <HStack
      bg={isSelected ? "brand.50" : "white"}
      _hover={{
        bg: "brand.50",
      }}
      borderBottomRadius={rounded ? "md" : ""}
      mt="0px !important"
      p={3}
      w="full"
      spacing={6}
    >
      <Checkbox value={cartItem.id} />
      <MyLinkOverlay
        href={`/products/${product.id}`}
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.400"
      >
        <Image
          borderRadius="md"
          boxSize="104px"
          objectFit="cover"
          src={productCover}
          alt={product.name}
        />
      </MyLinkOverlay>
      <MyLinkOverlay flex="1" href={`/products/${product.id}`}>
        <Text fontSize="xs">{product.name}</Text>
      </MyLinkOverlay>
      <Text flex="1" textAlign="center" fontSize="xs">
        {productPrice ? formatCcy(productPrice) + " đ" : "Liên hệ cửa hàng"}
      </Text>
      {isDeleting ? (
        <HStack>
          <Button
            onClick={onDelete}
            borderColor="red.700"
            size="sm"
            bg="red.500"
          >
            Xoá khỏi giò hàng
          </Button>
          <Button
            onClick={onNoDelete}
            borderColor="green.700"
            size="sm"
            bg="green.500"
          >
            Giữ lại
          </Button>
        </HStack>
      ) : (
        <HStack>
          <NumberInput
            flex="1"
            maxW="100px"
            value={qty}
            min={MINIMUM_QTY}
            max={maxStock}
            onChange={(_, newQty) => setQty(newQty)}
            size="sm"
            bg="white"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {cartItem.qty !== qty && (
            <Button
              size="sm"
              bg="green.500"
              borderColor="green.700"
              onClick={() => updateQty()}
            >
              Lưu
            </Button>
          )}
        </HStack>
      )}

      <Text
        flex="1"
        textAlign="center"
        fontWeight="medium"
        fontSize="sm"
        color="red.500"
      >
        {productPrice
          ? formatCcy(qty === 0 ? productPrice : productPrice * qty) + " đ"
          : "Liên hệ cửa hàng"}
      </Text>
      <Icon
        color="red.500"
        transitionDuration="0.2s"
        _hover={{
          transform: isDeleting ? "" : "scale(1.2)",
        }}
        cursor={isDeleting ? "not-allowed" : "pointer"}
        onClick={() => setDeleting(true)}
        as={BsTrash}
      />
      <Text>{cartItem.qty}</Text>
    </HStack>
  );
};

export default CartItemRow;
