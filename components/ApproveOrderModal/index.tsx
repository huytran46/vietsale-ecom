import React from "react";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  Text,
  VStack,
  Wrap,
  HStack,
  WrapItem,
  Textarea,
  Alert,
  AlertDescription,
  Icon,
  Checkbox,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BiBarcodeReader } from "react-icons/bi";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ApproveOrderPayload, Order, OrderStatus } from "models/Order";
import MyFormControl from "components/MyFormControl";
import MyDatePicker from "components/DatePicker";
import moment from "moment";
import { useUser } from "context/UserProvider";
import { useMutation, useQueryClient } from "react-query";
import { doApproveOrder } from "services/merchant";
import { FETCH_ORDERS_URI } from "services/order";

type Props = {
  token: string;
  shopId: string;
  order: Order;
  postOfficeType?: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ApproveOrderSchema = Yup.object().shape({
  note: Yup.string(),
  delivery_date: Yup.string(),
  post_office: Yup.boolean().required(),
  is_viewable: Yup.boolean(),
});

const ApproveOrderModal: React.FC<Props> = ({
  token,
  shopId,
  order,
  postOfficeType,
  isOpen,
  onOpen,
  onClose,
  children,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [data, setData] = React.useState<
    | {
        order_number: number;
        print_link?: string;
      }
    | undefined
  >();

  const [deliveryDate, setDeliveryDate] = React.useState(new Date());
  const { shopInfo } = useUser();
  const post_office = React.useMemo(
    () => Boolean(postOfficeType),
    [postOfficeType]
  );
  const shipServiceSlug = React.useMemo(
    () => order.edges?.logistic_service?.slug,
    [order]
  );

  const { mutate } = useMutation({
    mutationFn: (payload: ApproveOrderPayload) =>
      doApproveOrder(token, shopId, order.id, shipServiceSlug as any, payload),
  });

  const {
    handleSubmit,
    values,
    errors,
    touched,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = useFormik<ApproveOrderPayload>({
    initialValues: {
      delivery_date: moment().toDate().toISOString(),
      note: "",
      post_office,
      is_viewable: false,
    },
    validationSchema: ApproveOrderSchema,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      mutate(values, {
        onSettled() {
          queryClient.invalidateQueries([
            FETCH_ORDERS_URI,
            OrderStatus.PENDING,
          ]);
          actions.setSubmitting(false);
        },
        async onSuccess(resp) {
          if ((resp as any).httpCode) {
            toast({
              status: "error",
              duration: 5000,
              isClosable: true,
              description:
                ((resp as any).message as string) ??
                "Đã xảy ra lỗi khi duyệt đơn hàng",
              title: "Lỗi",
            });
            return;
          }
          setData(resp.data);
          actions.resetForm();
          toast({
            status: "success",
            duration: 2000,
            isClosable: true,
            description: "Duyệt đơn hàng thành công",
            title: "Thành công",
          });
        },
      });
    },
  });

  React.useEffect(() => {
    setFieldValue("delivery_date", deliveryDate.toISOString());
  }, [deliveryDate, setFieldValue]);

  return (
    <>
      {React.cloneElement(children as any, { onClick: onOpen })}
      <Modal size="xl" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" borderBottomColor="gray.100">
            <Text>Duyệt đơn hàng</Text>
          </ModalHeader>
          <ModalCloseButton />
          {isSubmitting && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
          {!isSubmitting && (
            <>
              {data ? (
                <Center w="full">
                  <VStack w="full" spacing={3} p={3}>
                    <HStack
                      justifyContent="flex-start"
                      alignItems="flex-end"
                      w="full"
                    >
                      <Text fontWeight="bold">Mã đơn hàng:</Text>
                      <Text as="code" fontWeight="bold" fontSize="lg">
                        {data.order_number}
                      </Text>
                    </HStack>
                    <VStack
                      justifyContent="flex-end"
                      alignItems="flex-start"
                      w="full"
                    >
                      <Text fontWeight="bold">Link in phiếu giao hàng:</Text>
                      <Text
                        w="full"
                        as="a"
                        cursor="pointer"
                        color="brand.500"
                        fontSize="sm"
                        _hover={{
                          textDecoration: "underline",
                        }}
                        href={data.print_link}
                        target="_blank"
                      >
                        {data.print_link}
                      </Text>
                    </VStack>
                  </VStack>
                </Center>
              ) : (
                <>
                  <ModalBody>
                    <VStack w="full" p={3} spacing={6}>
                      <Text as="b" d="flex" alignItems="center">
                        <Icon as={BiBarcodeReader} mr={2} fontSize="2xl" />
                        {order.code.toUpperCase()}
                      </Text>
                      <Wrap w="full">
                        <WrapItem w="full">
                          <MyFormControl id="address" label="Địa chỉ gửi hàng">
                            <Alert status="info" borderRadius="md">
                              <AlertDescription
                                fontWeight="bold"
                                display="block"
                                fontSize="sm"
                              >
                                {post_office
                                  ? "Tự đem ra bưu cục gần nhất"
                                  : shopInfo?.shop_address}
                              </AlertDescription>
                            </Alert>
                          </MyFormControl>
                        </WrapItem>
                        <WrapItem>
                          <MyFormControl
                            id="note"
                            label="Ghi chú (không bắt buộc)"
                          >
                            <Textarea
                              id="note"
                              size="sm"
                              placeholder="Ví dụ: Không cho xem hàng, hàng dễ vỡ,..."
                              onChange={handleChange}
                            />
                          </MyFormControl>
                        </WrapItem>
                        <WrapItem>
                          <MyFormControl
                            id="delivery"
                            label="Chọn ngày gửi hàng"
                          >
                            <MyDatePicker
                              minDate={moment().toDate()}
                              maxDate={moment(order.created_at)
                                .add(3, "d")
                                .toDate()}
                              onDateChange={(date) => setDeliveryDate(date)}
                            />
                          </MyFormControl>
                        </WrapItem>
                        <WrapItem>
                          <MyFormControl id="is_viewable" label="">
                            <Checkbox id="is_viewable" onChange={handleChange}>
                              Có thể xem hàng ?
                            </Checkbox>
                          </MyFormControl>
                        </WrapItem>
                      </Wrap>
                    </VStack>
                  </ModalBody>
                  <ModalFooter>
                    <HStack w="full" justifyContent="flex-end">
                      <Button
                        borderColor="brand.700"
                        size="sm"
                        onClick={handleSubmit as any}
                      >
                        Duyệt
                      </Button>
                    </HStack>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApproveOrderModal;
