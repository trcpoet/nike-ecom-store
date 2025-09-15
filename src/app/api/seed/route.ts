import { NextRequest, NextResponse } from 'next/server';
import { seedProducts } from '@/lib/db/seed';

// POST /api/seed - Seed the database with sample Nike products
export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Seeding is not allowed in production' 
        },
        { status: 403 }
      );
    }

    const products = await seedProducts();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} Nike products`,
      data: products,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database' 
      },
      { status: 500 }
    );
  }
}