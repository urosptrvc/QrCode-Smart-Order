"use client";

import { useOrders } from "@/src/hooks/useOrders";
import { Loading } from "@/src/components/ui/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Clock,
  Users,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  Play,
} from "lucide-react";

export default function OrdersPage() {
  const { orders, loading, error, updateOrderStatus } = useOrders();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading size="lg" text="Please wait..." />
      </div>
    );
  }

  if (error) throw new Error(`Failed to load orders,${error}`);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Order Management
              </h1>
              <p className="text-muted-foreground">Manage the orders</p>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{orders.length} Total Orders</span>
            </div>
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground text-center">
                  Orders will appear here when customers place them
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card
                key={order.id}
                className="flex flex-col h-full min-h-[400px] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      Table {order.table.number}
                    </CardTitle>
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(order.status)}
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Order #{order.id}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 justify-between space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {item.quantity}x
                          </Badge>
                          {item.product.name}
                        </span>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer deo: Total + Buttons */}
                  <div className="mt-auto pt-4 space-y-4">
                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center font-semibold">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total:
                      </span>
                      <span className="text-lg">
                        $
                        {order.items
                          .reduce(
                            (sum: any, item: any) =>
                              sum + item.product.price * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.status === "PENDING" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "IN_PROGRESS")
                          }
                          className="flex-1 min-w-0"
                          size="sm"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "IN_PROGRESS" && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "COMPLETED")
                          }
                          className="flex-1 min-w-0"
                          size="sm"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Completed
                        </Button>
                      )}
                      {(order.status === "PENDING" ||
                        order.status === "IN_PROGRESS") && (
                        <Button
                          onClick={() =>
                            updateOrderStatus(order.id, "CANCELED")
                          }
                          variant="destructive"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "IN_PROGRESS":
      return "default";
    case "COMPLETED":
      return "default";
    case "CANCELED":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-3 w-3" />;
    case "IN_PROGRESS":
      return <Package className="h-3 w-3" />;
    case "COMPLETED":
      return <CheckCircle className="h-3 w-3" />;
    case "CANCELED":
      return <XCircle className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};
