import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableId = searchParams.get('table');

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    // Convert tableId to number
    const tableIdNum = parseInt(tableId, 10);
    if (isNaN(tableIdNum)) {
      return NextResponse.json(
        { error: 'Invalid table ID' },
        { status: 400 }
      );
    }

    // Find the table by number (not ID)
    const table = await prisma.table.findUnique({
      where: {
        number: tableIdNum,
      },
    });

    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    // Get recommendations for this table
    const recommendations = await prisma.recommendation.findMany({
      where: {
        tableId: table.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: 3, // Limit to top 3 recommendations
    });

    // If no specific table recommendations, get general popular recommendations
    if (recommendations.length === 0) {
      const popularRecommendations = await prisma.recommendation.findMany({
        where: {
          tableId: null, // General recommendations not tied to a specific table
        },
        include: {
          product: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 3,
      });

      return NextResponse.json(popularRecommendations);
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}