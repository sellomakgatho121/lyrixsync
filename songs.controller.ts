
import { getSongs, getSong, getLyrics, addLyric, updateLyric, deleteLyric } from './songs.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';


import { getSongs, getSong, getLyrics, addLyric, updateLyric, deleteLyric } from './songs.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const getSongsController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { id, take, skip, search, sort } = req.query;

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (id) {
    const song = await getSong(id as string);
    return res.json(song);
  }

  const songs = await getSongs(
    session.user.id,
    take ? parseInt(take as string) : undefined,
    skip ? parseInt(skip as string) : undefined,
    search as string,
    sort as string
  );
  res.json(songs);
};

// ... (rest of the file)

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

export const addLyricController = async (req: NextApiRequest, res: NextApiResponse) => {
    const { songId, text, timestamp } = req.body;

    if (!songId || !text || !timestamp) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newLyric = await addLyric(songId, text, timestamp);
        res.status(201).json(newLyric);
    } catch (error) {
        console.error('Error adding lyric:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateLyricController = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, text, timestamp } = req.body;

    if (!id || !text || !timestamp) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedLyric = await updateLyric(id, text, timestamp);
        res.status(200).json(updatedLyric);
    } catch (error) {
        console.error('Error updating lyric:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteLyricController = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Missing id' });
    }

    try {
        await deleteLyric(id);
        res.status(200).json({ message: 'Lyric deleted successfully' });
    } catch (error) {
        console.error('Error deleting lyric:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
