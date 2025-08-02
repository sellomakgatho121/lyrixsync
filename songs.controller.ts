import { getSongs, getSong, getLyrics } from './songs.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const getSongsController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (id) {
    const song = await getSong(id as string);
    return res.json(song);
  }

  const songs = await getSongs(session.user.id);
  res.json(songs);
};

export const getLyricsController = async (req: NextApiRequest, res: NextApiResponse) => {
    const { songId } = req.query;

    if (!songId) {
        return res.status(400).json({ message: 'Missing songId' });
    }

    try {
        const lyrics = await getLyrics(songId as string);
        res.status(200).json(lyrics);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};