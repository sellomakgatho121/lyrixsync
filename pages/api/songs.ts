import { getSongsController } from '../../songs.controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getSongsController(req, res);
  }

  res.status(405).end();
}