
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSongs = async (userId: string) => {
  return prisma.song.findMany({
    where: {
      userId,
    },
  });
};

export const getSong = async (id: string) => {
  return prisma.song.findUnique({
    where: {
      id,
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

export const getLyrics = async (songId: string) => {
  return prisma.lyric.findMany({
    where: {
      songId,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
};
