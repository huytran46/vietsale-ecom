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

const MINIMUM_QTY = 0;

type Props = {
  cartItem: CartItem;
};

const CartItemRow: React.FC<Props> = ({ cartItem }) => {
  const [qty, setQty] = React.useState(cartItem.qty);
  const [isDeleting, setDeleting] = React.useState(cartItem.qty === 0);
  const product = React.useMemo(() => cartItem.edges?.is_product, [cartItem]);
  const productCover = React.useMemo(
    () => product.edges?.cover?.file_thumbnail,
    [product]
  );
  const productPrice = React.useMemo(
    () => product.discount_price ?? product.orig_price,
    [product]
  );

  React.useEffect(() => {
    if (qty !== 0) return;
    setDeleting(true);
  }, [qty]);

  function onDelete() {}

  function onNoDelete() {
    setDeleting(false);
    setQty(cartItem.qty);
  }

  return (
    <HStack mt="0px !important" p={3} w="full" spacing={6}>
      <Checkbox value={cartItem.id} />
      <Box borderRadius="md" borderWidth="1px" borderColor="gray.400">
        <Image
          borderRadius="md"
          boxSize="104px"
          objectFit="cover"
          src={productCover}
          alt={product.name}
        />
      </Box>
      <Text flex="1" fontSize="sm">
        {product.name}
      </Text>
      <Text flex="1" textAlign="center" fontSize="sm">
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
        <NumberInput
          flex="1"
          maxW="100px"
          value={qty}
          min={MINIMUM_QTY}
          onChange={(_, valAsNum) => setQty(valAsNum)}
          size="sm"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}

      <Text flex="1" textAlign="center" fontSize="sm" color="red.500">
        {productPrice
          ? formatCcy(qty === 0 ? productPrice : productPrice * qty) + " đ"
          : "Liên hệ cửa hàng"}
      </Text>
      <Icon
        cursor={isDeleting ? "not-allowed" : "pointer"}
        onClick={isDeleting ? undefined : onDelete}
        as={BsTrash}
      />
    </HStack>
  );
};

export default CartItemRow;
