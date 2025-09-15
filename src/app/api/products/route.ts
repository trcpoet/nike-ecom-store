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

    const base = db.select().from(products);
 
     const withWhere = search
       ? base.where(ilike(products.name, `%${search}%`))
       : base;
 
     const orderFn = sortOrder === 'asc' ? asc : desc;
     const orderExpr =
       sortBy === 'name'
         ? orderFn(products.name)
         : sortBy === 'price'
         ? orderFn(products.price)
         : orderFn(products.created_at);
 
     const withOrder = withWhere.orderBy(orderExpr);
     const allProducts = await withOrder.limit(limit).offset(offset);

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
