import { NextResponse } from "next/server";
import { getAllOrders } from "@/src/services/Order";
import { ValidateApiToken } from "@/src/lib/session/validateApiToken";

export async function GET() {
  try {
    const userSession = await ValidateApiToken();
    if (!userSession) {
      return NextResponse.json(
        { error: "Samo admin ima pristup" },
        { status: 403 },
      );
    }
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
