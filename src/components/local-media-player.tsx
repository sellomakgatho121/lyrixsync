import React, { useRef, useState } from 'react';
import { parseBlob } from 'music-metadata-browser';
import { Howl } from 'howler';
import lyricsFinder from 'lyrics-finder';

interface SongMeta {
  title: string;
  artist: string;
}

export default function LocalMediaPlayer() {
  const [meta, setMeta] = useState<SongMeta | null>(null);
  const [lyrics, setLyrics] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
    const metadata = await parseBlob(file);
    const title = metadata.common.title || '';
    const artist = metadata.common.artist || '';
    setMeta({ title, artist });
    // Fetch lyrics
    if (title && artist) {
      const foundLyrics = await lyricsFinder(artist, title) || 'Lyrics not found.';
      setLyrics(foundLyrics);
    } else {
      setLyrics('No metadata found.');
    }
  };

  const handlePlay = () => {
    if (howlRef.current) {
      howlRef.current.play();
      setIsPlaying(true);
      return;
    }
    howlRef.current = new Howl({
      src: [audioUrl],
      html5: true,
      onend: () => setIsPlaying(false),
    });
    howlRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    howlRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Local Media Lyrics Player</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {meta && (
        <div className="mt-4">
          <div className="mb-2">{meta.artist} - {meta.title}</div>
          <button onClick={isPlaying ? handlePause : handlePlay} className="px-4 py-2 bg-blue-500 text-white rounded">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
      {lyrics && (
        <div className="mt-4 whitespace-pre-wrap bg-gray-100 p-2 rounded">
          {lyrics}
        </div>
      )}
    </div>
  );
}
