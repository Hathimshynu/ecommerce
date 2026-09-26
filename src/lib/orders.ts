import type { OrderStatus } from "@/db/schema";

export const ORDER_STEPS: OrderStatus[] = ["confirmed", "shipped", "out_for_delivery", "delivered"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting Payment",
  confirmed: "Order Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-gray-400",
  confirmed: "bg-blue-500",
  shipped: "bg-indigo-500",
  out_for_delivery: "bg-amber-500",
  delivered: "bg-success",
  cancelled: "bg-red-500",
};
