import { useState } from "react";
import { useApi } from "@/src/hooks/useApi";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiPost } = useApi();

  function addToCart(product: Product) {
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
//        body: JSON.stringify({
//           tableId,
//           items: cart.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//           })),
//         }),
  async function submitOrder(payload: any) {
    setLoading(true);
    setError(null);
    try {
      const req = await apiPost("/api/orders", payload);
      const res = await req.json();
      if (!req.ok) {
        throw new Error(res.error || "Failed to place order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    submitOrder,
    cart,
    loading,
    error,
  };
}
