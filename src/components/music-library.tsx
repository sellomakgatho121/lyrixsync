'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library, Upload } from 'lucide-react';
import SpotifyIcon from './icons/spotify-icon';
import YoutubeMusicIcon from './icons/youtube-music-icon';
import type { Song } from '@/types';
import SongList from './song-list';

type MusicLibraryProps = {
  onSelectSong: (song: Song) => void;
  selectedSong: Song | null;
  spotifySongs: Song[];
  youtubeSongs: Song[];
  localSongs: Song[];
};

export default function MusicLibrary({ 
  onSelectSong, 
  selectedSong,
  spotifySongs,
  youtubeSongs,
  localSongs
}: MusicLibraryProps) {
  const [connected, setConnected] = useState({ spotify: false, youtube: false, local: false });

  const renderConnectView = (
    service: 'spotify' | 'youtube' | 'local',
    title: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
      <div className="bg-muted p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6">{description}</p>
      <Button onClick={() => setConnected((prev) => ({ ...prev, [service]: true }))}>
        Connect to {service.charAt(0).toUpperCase() + service.slice(1)}
      </Button>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="text-primary"/>
          Music Library
        </CardTitle>
        <CardDescription>Connect your accounts to sync your music.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spotify">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spotify"><SpotifyIcon className="w-5 h-5 mr-2"/>Spotify</TabsTrigger>
            <TabsTrigger value="youtube"><YoutubeMusicIcon className="w-5 h-5 mr-2"/>YouTube</TabsTrigger>
            <TabsTrigger value="local"><Upload className="w-5 h-5 mr-2"/>Local</TabsTrigger>
          </TabsList>
          <div className="mt-4 min-h-[400px]">
            <TabsContent value="spotify">
              {connected.spotify ? (
                <SongList songs={spotifySongs} selectedSong={selectedSong} onSelectSong={onSelectSong} />
              ) : (
                renderConnectView(
                  'spotify',
                  'Connect Spotify',
                  'Sync your saved songs and playlists from Spotify.',
                  <SpotifyIcon className="w-8 h-8 text-primary" />
                )
              )}
            </TabsContent>
            <TabsContent value="youtube">
              {connected.youtube ? (
                <SongList songs={youtubeSongs} selectedSong={selectedSong} onSelectSong={onSelectSong} />
              ) : (
                renderConnectView(
                  'youtube',
                  'Connect YouTube Music',
                  'Sync your library from YouTube Music.',
                  <YoutubeMusicIcon className="w-8 h-8 text-primary" />
                )
              )}
            </TabsContent>
            <TabsContent value="local">
               {connected.local ? (
                <SongList songs={localSongs} selectedSong={selectedSong} onSelectSong={onSelectSong} />
              ) : (
                renderConnectView(
                  'local',
                  'Sync Local Files',
                  'Upload and sync your local music files.',
                  <Upload className="w-8 h-8 text-primary" />
                )
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
