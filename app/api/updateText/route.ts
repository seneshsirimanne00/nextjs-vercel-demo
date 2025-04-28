import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text } = await request.json();
  
  // Here you could add database operations if needed
  
  return NextResponse.json({ text });
} 