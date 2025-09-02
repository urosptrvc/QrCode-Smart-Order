import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { toast } from "sonner";
import { CartItemType } from "@/src/types/CartItemType";
import { ProductType } from "@/src/types/ProductType";

export function useCart() {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { apiPost } = useApi();

  function addToCart(product: ProductType) {
    setCart((prevCart) => {
      // Check if product already in cart
      const existingItem = prevCart.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
          },
        ];
      }
    });
  }

  function updateCartItemQuantity(productId: number, newQuantity: number) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  }

  function removeFromCart(productId: number) {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId),
    );
  }

  async function submitOrder(payload: any) {
    setLoading(true);
    setError(false);
    try {
      await apiPost("/api/orders", payload);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error("Failed to place order. Please try again.");
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    submitOrder,
    setCart,
    cart,
    cartLoading: loading,
    cartError: error,
  };
}
