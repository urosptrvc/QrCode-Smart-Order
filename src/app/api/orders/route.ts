import { prisma } from '@/src/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, items, userId } = body;

    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data. Table ID and items are required.' },
        { status: 400 }
      );
    }

    // Find the table by number
    const table = await prisma.table.findUnique({
      where: {
        number: parseInt(tableId, 10),
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    // Create the order with items in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          tableId: table.id,
          userId: userId || undefined,
          status: 'PENDING',
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

    // Update recommendations based on this order
    // This could be done in a background job in a production environment
    await updateRecommendations(table.id, items.map(item => item.productId));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function updateRecommendations(tableId: number, productIds: number[]) {
  try {
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
            reason: 'Popular at this table',
            score: 1.0,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error updating recommendations:', error);
  }
}