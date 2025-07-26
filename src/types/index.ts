export type Song = {
  id: string;
  title: string;
  artist: string;
  source: 'spotify' | 'youtube' | 'local';
  coverArt: string;
};
