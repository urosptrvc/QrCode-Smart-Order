import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create tables
  const tables = await Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8].map(async (number) => {
      return prisma.table.create({
        data: {
          number,
          qrCodeUrl: `https://mojaapp.com/menu?table=${number}`,
        },
      });
    })
  );

  console.log(`Created ${tables.length} tables`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Espresso',
        description: 'Strong black coffee made by forcing steam through ground coffee beans',
        price: 2.50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cappuccino',
        description: 'Coffee made with milk that has been frothed up with pressurized steam',
        price: 3.50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Latte',
        description: 'Coffee made with espresso and steamed milk',
        price: 3.75,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Americano',
        description: 'Espresso with added hot water',
        price: 2.75,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mocha',
        description: 'Espresso with steamed milk and chocolate',
        price: 4.00,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 3.50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Iced Tea',
        description: 'Chilled tea with ice and lemon',
        price: 2.50,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sparkling Water',
        description: 'Carbonated mineral water',
        price: 2.00,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // Create some recommendations
  const recommendations = await Promise.all([
    // Table-specific recommendations
    prisma.recommendation.create({
      data: {
        tableId: tables[0].id,
        productId: products[0].id, // Espresso
        reason: 'Popular at this table',
        score: 0.9,
      },
    }),
    prisma.recommendation.create({
      data: {
        tableId: tables[0].id,
        productId: products[2].id, // Latte
        reason: 'Frequently ordered at this table',
        score: 0.8,
      },
    }),
    prisma.recommendation.create({
      data: {
        tableId: tables[1].id,
        productId: products[4].id, // Mocha
        reason: 'Popular at this table',
        score: 0.85,
      },
    }),
    // General recommendations
    prisma.recommendation.create({
      data: {
        productId: products[1].id, // Cappuccino
        reason: 'Most popular drink',
        score: 0.95,
      },
    }),
    prisma.recommendation.create({
      data: {
        productId: products[5].id, // Fresh Orange Juice
        reason: 'Trending now',
        score: 0.75,
      },
    }),
  ]);

  console.log(`Created ${recommendations.length} recommendations`);

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      tableId: tables[0].id,
      status: 'COMPLETED',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
          },
          {
            productId: products[2].id,
            quantity: 2,
          },
        ],
      },
    },
  });

  console.log(`Created sample order for table ${tables[0].number}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });