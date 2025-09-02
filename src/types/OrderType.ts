import { OrderItemType } from "@/src/types/OrderItemType";

export interface OrderType {
  id: number;
  tableId: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  createdAt: string;
  table: {
    number: number;
  };
  items: OrderItemType[];
}
