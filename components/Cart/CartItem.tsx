import React from "react";
import {
  HStack,
  Text,
  Checkbox,
  Image,
  Fade,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  Button,
  VStack,
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
  viewMode?: boolean;
};

const CartItemRow: React.FC<Props> = ({
  cartItem,
  isSelected,
  rounded,
  viewMode,
}) => {
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
    removeCartItem(cartItem.id, cartItem.qty);
  }

  function onNoDelete() {
    setDeleting(false);
    setQty(cartItem.qty);
  }

  return (
    <HStack
      bg={isSelected ? "brand.50" : "white"}
      borderBottomRadius={rounded ? "md" : ""}
      mt="0px !important"
      p={3}
      w="full"
      spacing={6}
    >
      {!viewMode && <Checkbox value={cartItem.id} disabled={viewMode} />}
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
      <MyLinkOverlay flex="2" href={`/products/${product.id}`}>
        <Text fontSize="xs">{product.name}</Text>
      </MyLinkOverlay>
      <Text flex="2" textAlign="center" fontSize="xs">
        {productPrice ? formatCcy(productPrice) + " đ" : "Liên hệ cửa hàng"}
      </Text>
      {isDeleting ? (
        <Fade in={isDeleting}>
          <HStack>
            <Button
              onClick={onDelete}
              borderColor="red.700"
              size="sm"
              bg="red.500"
            >
              Xoá khỏi giò hàng
            </Button>
            <Button onClick={onNoDelete} borderColor="brand.700" size="sm">
              Giữ lại
            </Button>
          </HStack>
        </Fade>
      ) : (
        <HStack>
          {!viewMode && (
            <NumberInput
              flex="2"
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
          )}
          {viewMode && (
            <Text fontSize="md" color="gray.500">
              x{formatCcy(qty)}
            </Text>
          )}
          {!viewMode && (
            <Fade in={cartItem.qty !== qty}>
              <Button
                disabled={cartItem.qty === qty}
                size="sm"
                borderColor="brand.700"
                onClick={() => updateQty()}
              >
                Lưu
              </Button>
            </Fade>
          )}
        </HStack>
      )}

      <Text
        flex="2"
        textAlign="center"
        fontWeight="medium"
        fontSize="sm"
        color="red.500"
      >
        {productPrice
          ? formatCcy(qty === 0 ? productPrice : productPrice * qty) + " đ"
          : "Liên hệ cửa hàng"}
      </Text>

      {!viewMode && (
        <Icon
          flex="1"
          color="red.500"
          transitionDuration="0.2s"
          _hover={{
            transform: isDeleting ? "" : "scale(1.2)",
          }}
          cursor={isDeleting ? "not-allowed" : "pointer"}
          onClick={() => setDeleting(true)}
          as={BsTrash}
        />
      )}
    </HStack>
  );
};

export default CartItemRow;
