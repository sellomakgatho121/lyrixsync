'use client';

import { useState, useEffect } from 'react';
import { generateLyrics, GenerateLyricsInput } from '@/ai/flows/generate-lyrics';
import type { Song } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Header from './layout/header';
import MusicLibrary from './music-library';
import LyricsDisplay from './lyrics-display';
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

  const fetchLyrics = async (artist: string, title: string) => {
    setIsLoading(true);
    setLyrics(null);
    setError(null);
    const lyricsId = `lyrics-${artist}-${title}`.replace(/\s+/g, '-').toLowerCase();

    try {
      // Offline-first approach
      const cachedLyrics = localStorage.getItem(lyricsId);
      if (cachedLyrics) {
        setLyrics(cachedLyrics);
        setIsLoading(false);
        return;
      }

      const input: GenerateLyricsInput = { artist, title };
      const result = await generateLyrics(input);

      if (result.lyrics) {
        setLyrics(result.lyrics);
        localStorage.setItem(lyricsId, result.lyrics);
      } else {
        throw new Error('Lyrics not found by AI.');
      }
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to fetch lyrics.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    fetchLyrics(song.artist, song.title);
  };
  
  const handleManualSearch = (artist: string, title: string) => {
    if(selectedSong){
        const newSongData = {...selectedSong, artist, title};
        setSelectedSong(newSongData);
    }
    fetchLyrics(artist, title);
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <MusicLibrary 
              onSelectSong={handleSelectSong} 
              selectedSong={selectedSong}
              spotifySongs={spotifySongs}
              youtubeSongs={youtubeSongs}
              localSongs={localSongs}
            />
          </div>
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <LyricsDisplay
              song={selectedSong}
              lyrics={lyrics}
              isLoading={isLoading}
              error={error}
              onManualSearch={handleManualSearch}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
