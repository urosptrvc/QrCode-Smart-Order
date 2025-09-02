import { prisma } from "@/src/lib/db";
import { Table } from "@prisma/client";

export async function updateRecommendations(
  tableId: number,
  productIds: number[],
) {
  // For each product ordered, increase its recommendation score for this table
  for (const productId of productIds) {
    // Check if recommendation already exists
    const existingRec = await prisma.recommendation.findFirst({
      where: {
        tableId: tableId,
        productId: productId,
      },
    });

    if (existingRec) {
      // Update existing recommendation
      await prisma.recommendation.update({
        where: { id: existingRec.id },
        data: {
          score: existingRec.score + 0.1, // Increment score
        },
      });
    } else {
      // Create new recommendation
      await prisma.recommendation.create({
        data: {
          tableId: tableId,
          productId: productId,
          reason: "Popular at this table",
          score: 1.0,
        },
      });
    }
  }
}

export async function getGeneralRecommendations(table: Table) {
  const recommendations = await prisma.recommendation.findMany({
    where: {
      tableId: table.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      score: "desc",
    },
    take: 3, // Limit to top 3 recommendations
  });
  return recommendations;
}

export async function getPopularRecommendations() {
  const popular = await prisma.recommendation.findMany({
    where: {
      tableId: null, // General recommendations not tied to a specific table
    },
    include: {
      product: true,
    },
    orderBy: {
      score: "desc",
    },
    take: 3,
  });
  return popular;
}
