
import Head from 'next/head'

import useSWR, { mutate } from 'swr'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session } = useSession()
  const { data: songs, error } = useSWR('/api/songs', fetcher)

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>LyrixSync</title>
        <meta name="description" content="Synchronize your lyrics with your music" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">LyrixSync</h1>
        <nav>
          <a href="#" className="mr-4">Home</a>
          <a href="#">About</a>
          {session ? (
            <button onClick={() => signOut()} className="ml-4">Sign Out</button>
          ) : (
            <button onClick={() => signIn('google')} className="ml-4">Sign In</button>
          )}
        </nav>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Your Songs</h2>
          {session && <NewSongForm />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => (
            <div key={song.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold">{song.title}</h3>
              <p className="text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p>&copy; 2025 LyrixSync. All rights reserved.</p>
      </footer>
    </div>
  )
}
function NewSongForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, artist, audioUrl }),
    })

    if (res.ok) {
      setTitle('')
      setArtist('')
      setAudioUrl('')
      mutate('/api/songs')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Song
      </button>
    </form>
  )
}

