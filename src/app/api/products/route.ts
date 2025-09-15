import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and } from 'drizzle-orm';

// GET /api/products - Get all products with optional filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(products);

    // Apply search filter
    if (search) {
      query = query.where(
        ilike(products.name, `%${search}%`)
      );
    }

    // Apply sorting
    const orderBy = sortOrder === 'asc' ? asc : desc;
    switch (sortBy) {
      case 'name':
        query = query.orderBy(orderBy(products.name));
        break;
      case 'price':
        query = query.orderBy(orderBy(products.price));
        break;
      case 'created_at':
      default:
        query = query.orderBy(orderBy(products.created_at));
        break;
    }

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const allProducts = await query;

    return NextResponse.json({
      success: true,
      data: allProducts,
      count: allProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name and price are required' 
        },
        { status: 400 }
      );
    }

    const newProduct = await db.insert(products).values({
      name: body.name,
      description: body.description || null,
      price: body.price,
      image_url: body.image_url || null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newProduct[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product' 
      },
      { status: 500 }
    );
  }
}