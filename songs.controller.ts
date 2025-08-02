
import { getSongs, addSong } from './songs.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const getSongsController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const songs = await getSongs(session.user.id);
  res.json(songs);
};

export const addSongController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { title, artist, audioUrl } = req.body;

  if (!title || !artist || !audioUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const song = await addSong(title, artist, audioUrl, session.user.id);
    res.status(201).json(song);
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
