import { prisma } from "@/src/lib/db";

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return products;
}
