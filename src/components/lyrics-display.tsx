'use client';

import { useEffect, useRef, useState } from 'react';
import type { Song } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music, Search, CloudOff } from 'lucide-react';

type LyricsDisplayProps = {
  song: Song | null;
  lyrics: string | null;
  isLoading: boolean;
  error: string | null;
  onManualSearch: (artist: string, title: string) => void;
};

export default function LyricsDisplay({ song, lyrics, isLoading, error, onManualSearch }: LyricsDisplayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const lyricsLines = lyrics ? lyrics.split('\n').filter(line => line.trim() !== '') : [];

  useEffect(() => {
    lineRefs.current = lineRefs.current.slice(0, lyricsLines.length);
  }, [lyricsLines.length]);

  useEffect(() => {
    if (lyrics && lyricsLines.length > 0) {
      setCurrentLineIndex(0);
      const interval = setInterval(() => {
        setCurrentLineIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= lyricsLines.length) {
            clearInterval(interval);
            return -1; // Reset highlighting
          }
          return nextIndex;
        });
      }, 3000); // Highlight new line every 3 seconds

      return () => clearInterval(interval);
    }
  }, [lyrics, lyricsLines.length]);

  useEffect(() => {
    if (currentLineIndex !== -1 && lineRefs.current[currentLineIndex]) {
      lineRefs.current[currentLineIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex]);
  
  const ManualSearchForm = () => {
    const [manualArtist, setManualArtist] = useState(song?.artist || '');
    const [manualTitle, setManualTitle] = useState(song?.title || '');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onManualSearch(manualArtist, manualTitle);
    };

    return (
      <div className="flex flex-col items-center justify-center text-center p-8 h-full">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <CloudOff className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Lyrics not found</h3>
        <p className="text-muted-foreground mb-6">We couldn't automatically find lyrics for this song. Please verify the details and try again.</p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div>
                <Label htmlFor="artist" className="text-left block mb-1">Artist</Label>
                <Input id="artist" value={manualArtist} onChange={e => setManualArtist(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="title" className="text-left block mb-1">Title</Label>
                <Input id="title" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
            </div>
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Search Manually
          </Button>
        </form>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      );
    }

    if (!song) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Music className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Welcome to LyrixSync</h3>
          <p className="text-muted-foreground">Select a song from your library to view its lyrics.</p>
        </div>
      );
    }
    
    if (error || !lyrics) {
        return <ManualSearchForm />;
    }

    return (
      <>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{song.title}</CardTitle>
          <p className="text-muted-foreground">{song.artist}</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh] pr-4">
            <div className="text-lg leading-loose space-y-4">
              {lyricsLines.map((line, index) => (
                <p
                  key={index}
                  ref={(el) => { lineRefs.current[index] = el; }}
                  className={`transition-all duration-300 ${
                    index === currentLineIndex
                      ? 'text-primary font-bold scale-105'
                      : 'text-foreground/70'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </>
    );
  };

  return <Card className="h-full flex flex-col">{renderContent()}</Card>;
}
