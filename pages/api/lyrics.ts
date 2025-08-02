import { getLyricsController } from '../../songs.controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getLyricsController(req, res);
  }

  res.status(405).end();
}