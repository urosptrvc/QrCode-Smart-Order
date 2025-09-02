export interface OrderItemType {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}
