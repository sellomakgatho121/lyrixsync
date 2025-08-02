
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


// ... (imports)

// ... (getSongs, getSong, addSong)

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

export const addLyric = async (songId: string, text: string, timestamp: number) => {
  return prisma.lyric.create({
    data: {
      songId,
      text,
      timestamp,
    },
  });
};

export const updateLyric = async (id: string, text: string, timestamp: number) => {
  return prisma.lyric.update({
    where: {
      id,
    },
    data: {
      text,
      timestamp,
    },
  });
};

export const deleteLyric = async (id: string) => {
  return prisma.lyric.delete({
    where: {
      id,
    },
  });
};

