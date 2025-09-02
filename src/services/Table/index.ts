import { prisma } from "@/src/lib/db";

export async function getTable(tableId: any) {
  const table = await prisma.table.findUnique({
    where: {
      number: parseInt(tableId, 10),
    },
  });

  return table;
}
