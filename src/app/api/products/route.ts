// src/app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database using the provided environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(req: NextRequest) {
  try {
    // Query to fetch all products from the PostgreSQL database
    const result = await pool.query('SELECT * FROM products WHERE avg_cycle IS NOT NULL');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}


