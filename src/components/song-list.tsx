'use client';

import type { Song } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

type SongListProps = {
  songs: Song[];
  selectedSong: Song | null;
  onSelectSong: (song: Song) => void;
};

export default function SongList({ songs, selectedSong, onSelectSong }: SongListProps) {
  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <Card
          key={song.id}
          onClick={() => onSelectSong(song)}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md hover:border-primary',
            selectedSong?.id === song.id && 'border-primary shadow-lg'
          )}
        >
          <CardContent className="p-3 flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
               <Image
                  src={song.coverArt}
                  alt={`Cover art for ${song.title}`}
                  width={64}
                  height={64}
                  className="object-cover h-full w-full"
                  data-ai-hint="album cover"
                />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="font-semibold truncate">{song.title}</p>
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
            </div>
            <Music className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
