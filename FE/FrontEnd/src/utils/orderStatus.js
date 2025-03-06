export interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export const ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};