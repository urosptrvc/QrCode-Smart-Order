import { prisma } from "@/src/lib/db";

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
        status: "asc", // PENDING first, then IN_PROGRESS, etc.
      },
      {
        createdAt: "desc", // Newest orders first within each status
      },
    ],
  });

  return orders;
}
