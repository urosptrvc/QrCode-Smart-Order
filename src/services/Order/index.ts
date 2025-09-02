import { prisma } from "@/src/lib/db";
import { OrderStatus, Table } from "@prisma/client";

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      table: {
        select: {
          number: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        status: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return orders;
}

export async function getOrder(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  return order;
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return updatedOrder;
}

export async function createOrder(table: Table, items: any) {
  const createdOrder = await prisma.$transaction(async (prisma) => {
    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        tableId: table.id,
        status: "PENDING",
      },
    });

    // Create order items
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity || 1,
        },
      });
    }
    return newOrder;
  });

  return createdOrder;
}
