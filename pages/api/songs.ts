
import { getSongsController, addSongController } from '../../songs.controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getSongsController(req, res);
  } else if (req.method === 'POST') {
    return addSongController(req, res);
  }

  res.status(405).end();
}
