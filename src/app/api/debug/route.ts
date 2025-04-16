import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { type, message } = await request.json();
  
  // Log to terminal
  console.log(`[${new Date().toISOString()}] [${type}] ${message}`);
  
  return NextResponse.json({ success: true });
}