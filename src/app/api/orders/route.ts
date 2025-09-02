import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/src/services/Order";
import { updateRecommendations } from "@/src/services/Recommendation";
import { getTable } from "@/src/services/Table";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, items } = body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data. Table ID and items are required." },
        { status: 400 },
      );
    }
    const table = await getTable(tableId);
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const newOrder = await createOrder(table, items);
    // Update recommendations based on this order
    await updateRecommendations(
      table.id,
      items.map((item) => item.productId),
    );

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
