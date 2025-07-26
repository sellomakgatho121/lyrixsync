  // Handler for selecting a song from the library
  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    // Optionally trigger lyrics fetch here
  };
'use client';

import { useState, useEffect } from 'react';
import { generateLyrics, GenerateLyricsInput } from '@/ai/flows/generate-lyrics';
import type { Song } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Header from './layout/header';
import MusicLibrary from './music-library';
import LyricsDisplay from './lyrics-display';
import LocalMediaPlayer from './local-media-player';
import SpotifyPlayer from './spotify-player';
import { Toaster } from './ui/toaster';

const spotifySongs: Song[] = [
  { id: 'sp1', title: 'Blinding Lights', artist: 'The Weeknd', source: 'spotify', coverArt: 'https://placehold.co/100x100.png' },
  { id: 'sp2', title: 'As It Was', artist: 'Harry Styles', source: 'spotify', coverArt: 'https://placehold.co/100x100.png' },
  { id: 'sp3', title: 'Levitating', artist: 'Dua Lipa', source: 'spotify', coverArt: 'https://placehold.co/100x100.png' },
  { id: 'sp4', title: 'Save Your Tears', artist: 'The Weeknd', source: 'spotify', coverArt: 'https://placehold.co/100x100.png' },
];

const youtubeSongs: Song[] = [
  { id: 'yt1', title: 'Bohemian Rhapsody', artist: 'Queen', source: 'youtube', coverArt: 'https://placehold.co/100x100.png' },
  { id: 'yt2', title: 'Shape of You', artist: 'Ed Sheeran', source: 'youtube', coverArt: 'https://placehold.co/100x100.png' },
  { id: 'yt3', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', source: 'youtube', coverArt: 'https://placehold.co/100x100.png' },
];

const localSongs: Song[] = [
    { id: 'lc1', title: 'Hotel California', artist: 'Eagles', source: 'local', coverArt: 'https://placehold.co/100x100.png' },
    { id: 'lc2', title: 'Stairway to Heaven', artist: 'Led Zeppelin', source: 'local', coverArt: 'https://placehold.co/100x100.png' },
]

export default function LyrixSyncPage() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  return (
    <>
      <Header />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <MusicLibrary
              spotifySongs={spotifySongs}
              youtubeSongs={youtubeSongs}
              localSongs={localSongs}
              onSelectSong={handleSelectSong}
              selectedSong={selectedSong}
            />
            <div className="mt-8">
              <LocalMediaPlayer />
            </div>
            <div className="mt-8">
              <SpotifyPlayer />
            </div>
          </div>
          <LyricsDisplay
            song={selectedSong}
            lyrics={lyrics}
            isLoading={isLoading}
            error={error}
            onManualSearch={(artist, title) => {
              setSelectedSong({ id: '', title, artist, source: 'local', coverArt: '' });
              // Optionally trigger lyrics fetch here
            }}
          />
        </div>
      </main>
      <Toaster />
    </>
  );
}
