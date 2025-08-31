interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    product: {
        name: string;
        price: number;
    };
}