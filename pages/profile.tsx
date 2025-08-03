
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { NextPage } from 'next'
import { Song } from '../types/song'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProfilePage: NextPage = () => {
    const { data: session } = useSession()
    const { data: songs, error } = useSWR<Song[]>(session ? '/api/songs' : null, fetcher)

    if (!session) return <div>Please sign in to view your profile.</div>

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-4">{session.user.name}'s Profile</h1>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Songs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {error && <p>Error loading songs.</p>}
                    {!songs && <p>Loading...</p>}
                    {songs && songs.map((song: Song) => (
                        <div key={song.id} className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-xl font-bold">{song.title}</h3>
                            <p className="text-gray-400">{song.artist}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
