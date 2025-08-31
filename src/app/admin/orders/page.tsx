'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  tableId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  table: {
    number: number;
  };
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    // Set up polling to refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  async function updateOrderStatus(orderId: number, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED') {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`border rounded-lg p-4 shadow-sm ${
                order.status === 'PENDING'
                  ? 'bg-yellow-50 border-yellow-200'
                  : order.status === 'IN_PROGRESS'
                  ? 'bg-blue-50 border-blue-200'
                  : order.status === 'COMPLETED'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Table {order.table.number}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Order #{order.id} • {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>${(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>
                    $
                    {order.items
                      .reduce(
                        (sum, item) => sum + item.product.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'IN_PROGRESS')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Mark Completed
                  </button>
                )}
                {(order.status === 'PENDING' || order.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'CANCELED')}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}