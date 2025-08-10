'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Library, Upload } from 'lucide-react';
import SpotifyIcon from './icons/spotify-icon';
import YoutubeMusicIcon from './icons/youtube-music-icon';
import type { Song } from '@/types';
import SongList from './song-list';
import { searchVideos } from '@/lib/youtube';

type MusicLibraryProps = {
  onSelectSong: (song: Song) => void;
  selectedSong: Song | null;
  spotifySongs: Song[];
  localSongs: Song[];
  isSpotifyConnected: boolean;
  onSelectFolder: () => void;
};

export default function MusicLibrary({ 
  onSelectSong, 
  selectedSong,
  spotifySongs,
  localSongs,
  isSpotifyConnected,
  onSelectFolder
}: MusicLibraryProps) {
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState('');
  const [youtubeSearchResults, setYoutubeSearchResults] = useState<Song[]>([]);

  const handleYoutubeSearch = async () => {
    const results = await searchVideos(youtubeSearchQuery);
    const songs = results.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      source: 'youtube',
      coverArt: item.snippet.thumbnails.default.url,
    }));
    setYoutubeSearchResults(songs);
  };

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
              {isSpotifyConnected ? (
                <SongList songs={spotifySongs} selectedSong={selectedSong} onSelectSong={onSelectSong} />
              ) : (
                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <SpotifyIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Connect Spotify</h3>
                  <p className="text-muted-foreground text-sm mb-6">Sync your saved songs and playlists from Spotify.</p>
                  {/* The actual connect button is in the header */}
                </div>
              )}
            </TabsContent>
            <TabsContent value="youtube">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search on YouTube"
                  value={youtubeSearchQuery}
                  onChange={(e) => setYoutubeSearchQuery(e.target.value)}
                />
                <Button onClick={handleYoutubeSearch}>Search</Button>
              </div>
              <SongList songs={youtubeSearchResults} selectedSong={selectedSong} onSelectSong={onSelectSong} />
            </TabsContent>
            <TabsContent value="local">
               {localSongs.length > 0 ? (
                <SongList songs={localSongs} selectedSong={selectedSong} onSelectSong={onSelectSong} />
              ) : (
                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Sync Local Files</h3>
                    <p className="text-muted-foreground text-sm mb-6">Upload and sync your local music files.</p>
                    <Button onClick={onSelectFolder}>Select Folder</Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
