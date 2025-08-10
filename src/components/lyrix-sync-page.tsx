'use client';

import { useState, useEffect } from 'react';
import type { Song } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Header from './layout/header';
import MusicLibrary from './music-library';
import LyricsDisplay from './lyrics-display';
import { Toaster } from './ui/toaster';
import { getCurrentlyPlayingTrack, getSavedTracks, getPlaylists, refreshAccessToken } from '@/lib/spotify';
import jsmediatags from 'jsmediatags';
import Visualizer from './visualizer';

export default function LyrixSyncPage() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [spotifySongs, setSpotifySongs] = useState<Song[]>([]);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [visualizerPreset, setVisualizerPreset] = useState<'waveform' | 'bars' | 'particles'>('waveform');

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
      setIsSpotifyConnected(true);
      fetchSpotifyData(accessToken);
    }
  }, []);

  const fetchSpotifyData = async (accessToken: string) => {
    try {
      const [savedTracks, playlists, currentlyPlaying] = await Promise.all([
        getSavedTracks(accessToken),
        getPlaylists(accessToken),
        getCurrentlyPlayingTrack(accessToken),
      ]);

      const savedSongs = savedTracks.items.map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(', '),
        source: 'spotify',
        coverArt: item.track.album.images[0]?.url,
      }));

      setSpotifySongs(savedSongs);

      if (currentlyPlaying && currentlyPlaying.item) {
        const currentSong = {
          id: currentlyPlaying.item.id,
          title: currentlyPlaying.item.name,
          artist: currentlyPlaying.item.artists.map((artist: any) => artist.name).join(', '),
          source: 'spotify',
          coverArt: currentlyPlaying.item.album.images[0]?.url,
        };
        setSelectedSong(currentSong);
        fetchLyrics(currentSong.artist, currentSong.title);
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (refreshToken) {
        refreshAccessToken(refreshToken).then((data) => {
          localStorage.setItem('spotify_access_token', data.access_token);
          fetchSpotifyData(data.access_token);
        });
      }
    }
  };

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

      const response = await fetch('/api/lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artist, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lyrics from API.');
      }

      const result = await response.json();

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
    if (song.source === 'local' && song.file) {
      const audioUrl = URL.createObjectURL(song.file);
      const audio = new Audio(audioUrl);
      setAudioPlayer(audio);
      audio.play();
    } else {
        setAudioPlayer(null);
    }
    fetchLyrics(song.artist, song.title);
  };
  
  const handleManualSearch = (artist: string, title: string) => {
    if(selectedSong){
        const newSongData = {...selectedSong, artist, title};
        setSelectedSong(newSongData);
    }
    fetchLyrics(artist, title);
  }

  const handleSelectFolder = async () => {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      const newSongs: Song[] = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && (entry.name.endsWith('.mp3') || entry.name.endsWith('.m4a'))) {
          const file = await entry.getFile();
          jsmediatags.read(file, {
            onSuccess: (tag: any) => {
              const newSong: Song = {
                id: file.name,
                title: tag.tags.title || 'Unknown Title',
                artist: tag.tags.artist || 'Unknown Artist',
                source: 'local',
                coverArt: '', // TODO: extract cover art
                file: file,
              };
              newSongs.push(newSong);
              setLocalSongs([...newSongs]);
            },
            onError: (error: any) => {
              console.error('Error reading media tags:', error);
            },
          });
        }
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <Visualizer audioPlayer={audioPlayer} preset={visualizerPreset} />
      <div className="container mx-auto">
        <Header setVisualizerPreset={setVisualizerPreset} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <MusicLibrary 
              onSelectSong={handleSelectSong} 
              selectedSong={selectedSong}
              spotifySongs={spotifySongs}
              isSpotifyConnected={isSpotifyConnected}
              onSelectFolder={handleSelectFolder}
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
              audioPlayer={audioPlayer}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
