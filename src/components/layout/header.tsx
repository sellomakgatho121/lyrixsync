'use client'

import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuthorizeUrl } from '@/lib/spotify';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    setIsSpotifyConnected(!!token);
  }, []);

  const handleLogin = () => {
    window.location.href = getAuthorizeUrl();
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    window.location.reload();
  };

  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Music className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-primary">LyrixSync</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Sync your music libraries and get lyrics instantly.
        </p>
      </div>
      {isSpotifyConnected ? (
        <Button onClick={handleLogout} variant="secondary">
          Disconnect Spotify
        </Button>
      ) : (
        <Button onClick={handleLogin}>Connect to Spotify</Button>
      )}
    </header>
  );
}
