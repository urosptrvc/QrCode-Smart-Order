import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function GET() {
  try {
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
          status: 'asc', // PENDING first, then IN_PROGRESS, etc.
        },
        {
          createdAt: 'desc', // Newest orders first within each status
        },
      ],
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}