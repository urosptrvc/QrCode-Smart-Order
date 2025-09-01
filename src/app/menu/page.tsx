"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useOptions } from "@/src/hooks/useOptions";
import { useCart } from "@/src/hooks/useCart";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("table");
  const { products, recommendations, loading, error } = useOptions(tableId);
  const {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    submitOrder,
  } = useCart();
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const handleSubmitOrder = async () => {
    try {
      setOrderStatus("submitting");
      setOrderMessage(null);
      await submitOrder(cart);
      setOrderStatus("success");
      setOrderMessage("Your order has been placed successfully!");
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Loading your menu...
          </p>
        </div>
      </div>
    );
  }

  if (error) throw error;

  if (!tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-center">
            <div className="font-semibold mb-2">Table Not Found</div>
            Please scan a valid QR code to access your table&#39;s menu.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Table {tableId}
              </h1>
              <p className="text-muted-foreground">Choose your perfect drink</p>
            </div>
            {cart.length > 0 && (
              <Badge variant="secondary" className="gap-2 px-3 py-2">
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount} items
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {recommendations.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold tracking-tight">
                Recommended for You
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Recommended
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-balance">
                      {rec.product.name}
                    </CardTitle>
                    <CardDescription className="text-pretty leading-relaxed min-h-[50px]">
                      {rec.product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 min-h-[120px]">
                    <div className="text-2xl font-bold">
                      ${rec.product.price}
                    </div>
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertDescription className="text-amber-800">
                        <span className="font-medium">Why we recommend: </span>
                        {rec.reason}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      onClick={() => addToCart(rec.product)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      size="lg"
                    >
                      Add to Order
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">All Drinks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-balance">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-pretty leading-relaxed min-h-[50px]">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 min-h-[120px]">
                  <div className="text-2xl font-bold">${product.price}</div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full"
                    size="lg"
                  >
                    Add to Order
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {cart.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className=" text-primary">
              <CardTitle className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6" />
                Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.productId,
                            item.quantity + 1,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-3xl font-bold text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  disabled={orderStatus === "submitting"}
                  className="w-full"
                  size="lg"
                >
                  {orderStatus === "submitting"
                    ? "Placing Order..."
                    : "Place Order"}
                </Button>

                {orderMessage && (
                  <Alert
                    className={
                      orderStatus === "success"
                        ? "border-green-200 bg-green-50"
                        : "border-destructive/50 bg-destructive/10"
                    }
                  >
                    <AlertDescription
                      className={
                        orderStatus === "success"
                          ? "text-green-800"
                          : "text-destructive"
                      }
                    >
                      {orderMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
