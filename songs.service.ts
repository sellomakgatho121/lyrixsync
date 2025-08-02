
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSongs = async (userId: string) => {
  return prisma.song.findMany({
    where: {
      userId,
    },
  });
};

export const addSong = async (title: string, artist: string, audioUrl: string, userId: string) => {
  return prisma.song.create({
    data: {
      title,
      artist,
      audioUrl,
      userId,
    },
  });
};
