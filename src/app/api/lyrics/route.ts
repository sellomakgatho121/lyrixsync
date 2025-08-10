import { generateLyrics } from '@/ai/flows/generate-lyrics';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { artist, title } = await req.json();
    const result = await generateLyrics({ artist, title });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
