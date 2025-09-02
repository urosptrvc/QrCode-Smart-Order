import { ProductType } from "@/src/types/ProductType";

export interface RecommendationType {
  id: number;
  productId: number;
  product: ProductType;
  reason: string;
  score: number;
}
