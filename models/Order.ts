import { CartItem } from "./Cart";
import { Shop } from "./Shop";
import { User } from "./User";

export enum OrderStatus {
  PENDING = "pending",
  PICKING = "picking",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELED = "canceled",
  RETURNED = "returned",
  FAILED = "failed",
}

export const OrderStatusesArr = Object.values(OrderStatus);

export const OrderStatusMapLang: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  [OrderStatus.PENDING]: { label: "Chờ duyệt", color: "yellow" },
  [OrderStatus.PICKING]: { label: "Chờ lấy hàng", color: "brand" },
  [OrderStatus.DELIVERING]: { label: "Đang giao", color: "orange" },
  [OrderStatus.DELIVERED]: { label: "Đã giao", color: "green" },
  [OrderStatus.CANCELED]: { label: "Đã huỷ", color: "red" },
  [OrderStatus.RETURNED]: { label: "Đã hoàn trả", color: "pink" },
  [OrderStatus.FAILED]: { label: "Thất bại", color: "red" },
};

interface LogisticService {
  id: number;
  name: string;
  slug: string;
  max_weight: number;
  min_weight: number;
  max_price: number;
  created_at: string;
  updated_at: string;
  edges: unknown;
}
interface PaymentMethod {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  edges?: unknown;
}

interface OrderItem {
  id: string;
  created_at: string;
  updated_at: string;
  edges: {
    is_cart_item: CartItem;
  };
}

export interface Order {
  id: string;
  code: string;
  total_item: number;
  total_price: number;
  fullname: string;
  phone: string;
  address: string;
  final_price: number;
  shipping_fee: number;
  status: OrderStatus;
  paid_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  edges: {
    has_items: OrderItem[];
    using_payment_method: PaymentMethod;
    owner: User;
    shop: Shop;
    logistic_service: LogisticService;
  };
}
