import { NextRequest, NextResponse } from "next/server";
import { getTable } from "@/src/services/Table";
import {
  getGeneralRecommendations,
  getPopularRecommendations,
} from "@/src/services/Recommendation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableId = searchParams.get("table");
    if (!tableId) {
      return NextResponse.json(
        { error: "Table ID is required" },
        { status: 400 },
      );
    }
    const table = await getTable(tableId);
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Get recommendations for this table
    const recommendations = await getGeneralRecommendations(table);

    // If no specific table recommendations, get general popular recommendations
    if (recommendations.length === 0) {
      const popularRecommendations = await getPopularRecommendations();
      return NextResponse.json(popularRecommendations);
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}
