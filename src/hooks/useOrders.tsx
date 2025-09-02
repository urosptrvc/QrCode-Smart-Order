import { useEffect, useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { OrderType } from "@/src/types/OrderType";

export function useOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { apiGet, apiPatch } = useApi();

  async function fetchOrders() {
    try {
      const response = await apiGet("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(
    orderId: any,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
  ) {
    try {
      const response = await apiPatch(`/api/admin/orders/${orderId}`, status);
      if (!response) throw new Error("Failed to update order status");

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err: any) {
      setError(err);
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); // 10 sekundi

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
  };
}
