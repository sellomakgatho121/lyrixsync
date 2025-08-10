const apiKey = process.env.YOUTUBE_API_KEY;

export const searchVideos = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('YouTube API request failed');
  }

  const data = await response.json();
  return data.items;
};
