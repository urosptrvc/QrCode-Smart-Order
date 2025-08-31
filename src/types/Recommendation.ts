interface Recommendation {
    id: number;
    productId: number;
    product: Product;
    reason: string;
    score: number;
}