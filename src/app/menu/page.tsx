'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('table');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  useEffect(() => {
    async function fetchData() {
      if (!tableId) {
        setError('Table ID is required');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch menu products
        const productsResponse = await fetch(`/api/products`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        
        // Fetch recommendations for this table
        const recommendationsResponse = await fetch(`/api/recommendations?table=${tableId}`);
        if (!recommendationsResponse.ok) throw new Error('Failed to fetch recommendations');
        const recommendationsData = await recommendationsResponse.json();
        
        setProducts(productsData);
        setRecommendations(recommendationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [tableId]);
  
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
  
  if (!tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>No table ID provided. Please scan a valid QR code.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Menu for Table {tableId}</h1>
      </header>
      
      {recommendations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-amber-50 border border-amber-100 rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-medium">{rec.product.name}</h3>
                <p className="text-gray-600 mt-1">{rec.product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold">${rec.product.price}</span>
                  <span className="text-sm text-amber-700">{rec.reason}</span>
                </div>
                <button 
                  onClick={() => addToCart(rec.product)} 
                  className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
              >
                  Add to Order
              </button>
              </div>
            ))}
          </div>
        </section>
      )}
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Drinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium">{product.name}</h3>
              <p className="text-gray-600 mt-1">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">${product.price}</span>
              </div>
              <button 
                onClick={() => addToCart(product)} 
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Cart Section */}
      {cart.length > 0 && (
        <section className="mt-10 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center mt-1">
                    <button 
                      onClick={() => updateCartItemQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="bg-gray-200 px-2 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                      className="bg-gray-200 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between font-bold pt-2">
              <span>Total:</span>
              <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={submitOrder}
              disabled={orderStatus === 'submitting'}
              className={`mt-4 w-full py-3 rounded font-medium ${orderStatus === 'submitting' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {orderStatus === 'submitting' ? 'Placing Order...' : 'Place Order'}
            </button>
            
            {orderMessage && (
              <div className={`mt-4 p-3 rounded ${orderStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {orderMessage}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
  
  // Cart functions
  function addToCart(product: Product) {
    setCart(prevCart => {
      // Check if product already in cart
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1
        }];
      }
    });
  }
  
  function updateCartItemQuantity(productId: number, newQuantity: number) {
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }
  
  function removeFromCart(productId: number) {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }
  
  async function submitOrder() {
    if (!tableId || cart.length === 0) return;
    
    setOrderStatus('submitting');
    setOrderMessage(null);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }
      
      setOrderStatus('success');
      setOrderMessage('Order placed successfully! A waiter will be with you shortly.');
      setCart([]);
    } catch (err) {
      setOrderStatus('error');
      setOrderMessage(err instanceof Error ? err.message : 'An error occurred while placing your order');
    }
  }
}