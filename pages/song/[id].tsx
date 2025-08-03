
import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import ReactPlayer from 'react-player'

interface Lyric {
    id: string;
    text: string;
    timestamp: number;
}

interface Song {
    title: string;
    artist: string;
    audioUrl: string;
}

let socket: Socket

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SongPage: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: song, error: songError } = useSWR<Song>(id ? `/api/songs?id=${id}` : null, fetcher)
    const { data: initialLyrics, error: lyricsError } = useSWR(id ? `/api/lyrics?songId=${id}` : null, fetcher)

    const [lyrics, setLyrics] = useState<Lyric[]>([])
    const [newLyricText, setNewLyricText] = useState('')
    const [newLyricTimestamp, setNewLyricTimestamp] = useState(0)
    const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null)

            const playerRef = useRef(null)

    useEffect(() => {
        if (initialLyrics) {
            setLyrics(initialLyrics)
        }
    }, [initialLyrics])

    useEffect(() => {
        socketInitializer()
        return () => {
            if (socket) socket.disconnect()
        }
    }, [id])

    const socketInitializer = async () => {
        if (!id) return
        await fetch('/api/socket');
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
            socket.emit('join-room', `song-${id}`)
        })

        socket.on('lyric-updated', () => {
            mutate(`/api/lyrics?songId=${id}`)
        })
    }

    const handleAddLyric = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLyricText || !newLyricTimestamp) return

        const res = await fetch('/api/lyrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songId: id, text: newLyricText, timestamp: newLyricTimestamp }),
        })

        if (res.ok) {
            const newLyric: Lyric = await res.json()
            setLyrics([...lyrics, newLyric])
            setNewLyricText('')
            setNewLyricTimestamp(0)
            socket.emit('lyric-change', `song-${id}`)
        }
    }

    const handleDeleteLyric = async (lyricId: string) => {
        const res = await fetch('/api/lyrics', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: lyricId }),
        })

        if (res.ok) {
            setLyrics(lyrics.filter(lyric => lyric.id !== lyricId))
            socket.emit('lyric-change', `song-${id}`)
        }
    }

    interface ProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

    const handleProgress = ({ playedSeconds }: ProgressState) => {
        const current = lyrics.find(lyric => playedSeconds >= lyric.timestamp)
        if (current) {
            setCurrentLyric(current)
        }
    }

    if (songError || lyricsError) return <div>Failed to load</div>
    if (!song) return <div>Loading...</div>

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-4">{song.title}</h1>
            <h2 className="text-2xl text-gray-400 mb-8">{song.artist}</h2>

            <ReactPlayer
                ref={playerRef}
                url={song.audioUrl}
                controls
                                onProgress={handleProgress}
            />

            <div className="prose prose-invert mt-8">
                {lyrics.map((lyric) => (
                    <div key={lyric.id} className={`flex items-center justify-between ${currentLyric?.id === lyric.id ? 'bg-gray-700' : ''}`}>
                        <p data-timestamp={lyric.timestamp}>
                            {lyric.text}
                        </p>
                        <button onClick={() => handleDeleteLyric(lyric.id)} className="text-red-500">Delete</button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddLyric} className="mt-8 flex space-x-4">
                <input
                    type="text"
                    placeholder="Lyric text"
                    value={newLyricText}
                    onChange={(e) => setNewLyricText(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white"
                />
                <input
                    type="number"
                    placeholder="Timestamp (in seconds)"
                    value={newLyricTimestamp}
                    onChange={(e) => setNewLyricTimestamp(Number(e.target.value))}
                    className="p-2 rounded bg-gray-700 text-white"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Lyric
                </button>
            </form>
        </div>
    )
}

export default SongPage
