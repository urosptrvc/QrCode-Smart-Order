import { useEffect, useState } from "react";
import { useApi } from "@/src/hooks/useApi";
import { RecommendationType } from "@/src/types/RecommendationType";
import { ProductType } from "@/src/types/ProductType";

export function useOptions(tableId: any) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendationType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiGet } = useApi();

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const req = await apiGet("/api/products");
      const res = await req.json();
      setProducts(res);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecommendedProducts(tableid: any) {
    setLoading(true);
    setError(null);
    try {
      const req = await apiGet(`/api/recommendations?table=${tableid}`);
      const res = await req.json();
      setRecommendedProducts(res);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTableData(tableid: any) {
    await fetchProducts();
    await fetchRecommendedProducts(tableid);
  }

  useEffect(() => {
    if (tableId) fetchTableData(tableId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    recommendations: recommendedProducts,
    loading,
    error,
  };
}
