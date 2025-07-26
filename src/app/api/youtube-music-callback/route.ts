import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'https://lyrixsync.vercel.app/api/youtube-music-callback';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('grant_type', 'authorization_code');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.access_token) {
    // Redirect to home with token in query (for demo; use cookies/localStorage in production)
    return NextResponse.redirect(`/?youtube_token=${data.access_token}`);
  } else {
    return NextResponse.json({ error: 'Failed to get access token', details: data }, { status: 400 });
  }
}
