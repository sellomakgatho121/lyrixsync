
import { getSongsController, getLyricsController, addLyricController, updateLyricController, deleteLyricController } from '../../songs.controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getLyricsController(req, res);
  } else if (req.method === 'POST') {
    return addLyricController(req, res);
  } else if (req.method === 'PUT') {
    return updateLyricController(req, res);
  } else if (req.method === 'DELETE') {
    return deleteLyricController(req, res);
  }

  res.status(405).end();
}
