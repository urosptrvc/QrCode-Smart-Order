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