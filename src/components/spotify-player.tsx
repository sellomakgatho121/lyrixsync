const CLIENT_ID = '81f00f9648bf426b8e71d74a39ced7ae';
const REDIRECT_URI = 'https://lyrixsync.vercel.app';
const SCOPES = 'user-read-playback-state user-read-currently-playing';
const loginUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import lyricsFinder from 'lyrics-finder';

const spotifyApi = new SpotifyWebApi();

export default function SpotifyPlayer() {
  const [token, setToken] = useState('');
  const [track, setTrack] = useState<any>(null);
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('spotify_token');
    if (urlToken) {
      setToken(urlToken);
      // Optionally store in localStorage for future use
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMyCurrentPlaybackState().then(state => {
        if (state && state.item) {
          setTrack(state.item);
        }
      });
    }
  }, [token]);

  useEffect(() => {
    if (track && track.artists && track.name) {
      const artist = track.artists[0].name;
      const title = track.name;
      lyricsFinder(artist, title).then(result => setLyrics(result || "No lyrics found."));
    }
  }, [track]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Spotify Player</h2>
      {!token && (
        <div>
          <a href={loginUrl} className="px-4 py-2 bg-green-500 text-white rounded inline-block mt-2">Connect to Spotify</a>
        </div>
      )}
      {track && (
        <div className="mt-4">
          <div className="mb-2">{track.artists[0].name} - {track.name}</div>
          <img src={track.album.images[0].url} alt="cover" className="w-32 h-32 mb-2" />
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
