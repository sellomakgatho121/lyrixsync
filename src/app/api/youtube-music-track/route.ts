import { NextRequest, NextResponse } from 'next/server';

let currentTrack: any = null;

export async function POST(req: NextRequest) {
  const data = await req.json();
  currentTrack = data;
  return NextResponse.json({ status: 'ok' });
}

export async function GET() {
  if (!currentTrack) {
    return NextResponse.json({ error: 'No track info yet' }, { status: 404 });
  }
  return NextResponse.json(currentTrack);
}
