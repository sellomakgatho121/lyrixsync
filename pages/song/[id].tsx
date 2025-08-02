
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { NextPage } from 'next'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SongPage: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: song, error: songError } = useSWR(`/api/songs?id=${id}`, fetcher)
    const { data: lyrics, error: lyricsError } = useSWR(`/api/lyrics?songId=${id}`, fetcher)

    if (songError || lyricsError) return <div>Failed to load</div>
    if (!song || !lyrics) return <div>Loading...</div>

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-4">{song.title}</h1>
            <h2 className="text-2xl text-gray-400 mb-8">{song.artist}</h2>

            <div className="prose prose-invert">
                {lyrics.map((lyric) => (
                    <p key={lyric.id} data-timestamp={lyric.timestamp}>
                        {lyric.text}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default SongPage
