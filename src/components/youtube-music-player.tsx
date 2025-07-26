import React, { useEffect, useState } from 'react';
import lyricsFinder from 'lyrics-finder';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const REDIRECT_URI = 'https://lyrixsync.vercel.app/api/youtube-music-callback';
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';
const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}&access_type=online&prompt=consent`;

export default function YouTubeMusicPlayer() {

  const [track, setTrack] = useState<any>(null);
  const [lyrics, setLyrics] = useState('');

  // Poll backend for current track every 2 seconds
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch('/api/youtube-music-track');
        if (res.ok) {
          const data = await res.json();
          setTrack(data);
        } else {
          setTrack(null);
        }
      } catch {
        setTrack(null);
      }
    };
    fetchTrack();
    const interval = setInterval(fetchTrack, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (track && track.artist && track.title) {
      lyricsFinder(track.artist, track.title).then(result => setLyrics(result || "No lyrics found."));
    } else {
      setLyrics("");
    }
  }, [track]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">YouTube Music Player</h2>
      {/* No connect button needed for real-time sync mode */}
      {track && (
        <div className="mt-4">
          <div className="mb-2">{track.artist} - {track.title}</div>
          {track.cover && <img src={track.cover} alt="cover" className="w-32 h-32 mb-2" />}
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
