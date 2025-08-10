// TODO: Replace with your client ID and secret
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Scopes we need to access the user's data
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

// The authorization URL
export const getAuthorizeUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId || '',
    scope: scopes,
    redirect_uri: redirectUri || '',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Get an access token from the authorization code
export const getAccessToken = async (code: string) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri || '',
    }),
  });

  const data = await response.json();
  return data;
};

// A helper function to make requests to the Spotify API
const spotifyApiRequest = async (url: string, accessToken: string) => {
    const response = await fetch(url, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Spotify API request failed: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const getCurrentlyPlayingTrack = (accessToken: string) => {
    return spotifyApiRequest('https://api.spotify.com/v1/me/player/currently-playing', accessToken);
}

export const getSavedTracks = (accessToken: string) => {
    return spotifyApiRequest('https://api.spotify.com/v1/me/tracks', accessToken);
}

export const getPlaylists = (accessToken: string) => {
    return spotifyApiRequest('https://api.spotify.com/v1/me/playlists', accessToken);
}

// Refresh the access token
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  return data;
};
