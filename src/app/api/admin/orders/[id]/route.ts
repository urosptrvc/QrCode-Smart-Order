import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/src/services/Order";

export async function PATCH(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = await params;
    const orderId = +id;
    if (!orderId) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const status = await request.json();

    if (
      !status ||
      !["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
