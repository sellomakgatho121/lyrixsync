import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = '81f00f9648bf426b8e71d74a39ced7ae';
const CLIENT_SECRET = '8e976f438d81485d89fb875ded9551cb';
const REDIRECT_URI = 'https://lyrixsync.vercel.app/api/spotify-callback';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.access_token) {
    // Redirect to home with token in query (for demo; use cookies/localStorage in production)
    return NextResponse.redirect(`/?spotify_token=${data.access_token}`);
  } else {
    return NextResponse.json({ error: 'Failed to get access token', details: data }, { status: 400 });
  }
}
